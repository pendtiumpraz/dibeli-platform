import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function getDriveClient() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      throw new Error('Not authenticated')
    }

    console.log(`Getting Drive client for user: ${session.user.email}`)

    // Get user's OAuth tokens from database
    let account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    })

    if (!account) {
      throw new Error('No Google account linked. Please re-login with Google.')
    }

    if (!account.access_token) {
      throw new Error('No Google access token found. Please re-login.')
    }

    console.log('OAuth tokens found, checking expiry...')

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + '/api/auth/callback/google'
    )

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    })

    // Check if token is expired and refresh if needed
    const now = Math.floor(Date.now() / 1000)
    if (account.expires_at && account.expires_at < now) {
      console.log('Access token expired, refreshing...')
      
      try {
        const { credentials } = await oauth2Client.refreshAccessToken()
        console.log('Token refreshed successfully')
        
        // Update account with new token
        account = await prisma.account.update({
          where: { id: account.id },
          data: {
            access_token: credentials.access_token,
            expires_at: credentials.expiry_date ? Math.floor(credentials.expiry_date / 1000) : null,
            refresh_token: credentials.refresh_token || account.refresh_token, // Keep old if not provided
          },
        })
        
        // Update oauth client with new token
        oauth2Client.setCredentials({
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token || account.refresh_token,
        })
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError)
        throw new Error('Token expired and refresh failed. Please logout and login again.')
      }
    } else {
      console.log('Access token still valid')
    }

    const drive = google.drive({ version: 'v3', auth: oauth2Client })
    console.log('Drive client created successfully')
    
    return drive
  } catch (error) {
    console.error('Failed to get Drive client:', error)
    throw error
  }
}

export async function createFolderStructure(storeName: string, productName: string) {
  const drive = await getDriveClient()

  try {
    // Option 1: Use existing folder by ID (if provided)
    const rootFolderId = process.env.DRIVE_ROOT_FOLDER_ID
    
    // Option 2: Use folder name (create if not exist)
    const rootFolderName = process.env.DRIVE_ROOT_FOLDER || 'dibeli.my.id'
    const storesFolderName = process.env.DRIVE_STORES_FOLDER || 'toko'

    let rootFolder: string
    
    if (rootFolderId) {
      // Use existing folder by ID
      console.log(`Using existing root folder ID: ${rootFolderId}`)
      rootFolder = rootFolderId
    } else {
      // Find or create folder by name
      const existingFolder = await findFolder(drive, rootFolderName)
      if (existingFolder) {
        rootFolder = existingFolder
        console.log(`Found existing root folder: ${rootFolderName}`)
      } else {
        rootFolder = await createFolder(drive, rootFolderName, null)
        console.log(`Created root folder: ${rootFolderName}`)
      }
    }

    // Check if stores folder exists
    let storesFolder = await findFolder(drive, storesFolderName, rootFolder)
    if (!storesFolder) {
      storesFolder = await createFolder(drive, storesFolderName, rootFolder)
      console.log(`Created stores folder: ${storesFolderName}`)
    }

    // Check if store folder exists
    let storeFolder = await findFolder(drive, storeName, storesFolder)
    if (!storeFolder) {
      storeFolder = await createFolder(drive, storeName, storesFolder)
      console.log(`Created store folder: ${storeName}`)
    }

    // Create product folder
    const productFolder = await createFolder(drive, productName, storeFolder)
    console.log(`Created product folder: ${productName}`)

    return productFolder
  } catch (error) {
    console.error('Error creating folder structure:', error)
    throw error
  }
}

async function findFolder(drive: any, name: string, parentId?: string) {
  try {
    const query = parentId
      ? `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
      : `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    })

    return response.data.files?.[0]?.id || null
  } catch (error) {
    console.error('Error finding folder:', error)
    return null
  }
}

async function createFolder(drive: any, name: string, parentId: string | null) {
  const fileMetadata: any = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  }

  if (parentId) {
    fileMetadata.parents = [parentId]
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  })

  return response.data.id
}

export async function uploadImageToDrive(
  file: File,
  folderId: string,
  fileName: string
): Promise<{ id: string; webViewLink: string; webContentLink: string; thumbnailLink: string }> {
  const drive = await getDriveClient()

  try {
    console.log(`🔵 Starting upload: ${fileName}`)
    console.log(`   - Size: ${file.size} bytes`)
    console.log(`   - Type: ${file.type}`)
    console.log(`   - Folder ID: ${folderId}`)
    
    // Convert File to buffer
    console.log('📦 Converting file to buffer...')
    const arrayBuffer = await file.arrayBuffer()
    console.log(`   - ArrayBuffer size: ${arrayBuffer.byteLength} bytes`)
    
    const buffer = Buffer.from(arrayBuffer)
    console.log(`   - Buffer size: ${buffer.length} bytes`)
    
    // Create readable stream from buffer
    console.log('🌊 Creating stream from buffer...')
    const { Readable } = await import('stream')
    const stream = Readable.from(buffer)

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    }

    console.log('☁️ Uploading to Google Drive...')
    console.log(`   - Metadata:`, JSON.stringify(fileMetadata))
    
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink, thumbnailLink',
    })
    
    console.log('✅ Upload response received')
    console.log(`   - File ID: ${response.data.id}`)

    // Make file publicly accessible
    console.log('🔓 Setting public permissions...')
    if (response.data.id) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })
      console.log('✅ Permissions set successfully')
    }

    const result = {
      id: response.data.id!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink!,
      thumbnailLink: response.data.thumbnailLink!,
    }
    
    console.log('🎉 Upload complete!')
    console.log(`   - File ID: ${result.id}`)
    console.log(`   - View URL: https://drive.google.com/uc?export=view&id=${result.id}`)
    
    return result
  } catch (error) {
    console.error('❌ Error uploading to Drive:', error)
    if (error instanceof Error) {
      console.error('   - Message:', error.message)
      console.error('   - Stack:', error.stack)
    }
    throw error
  }
}

export function getDriveImageUrl(fileId: string): string {
  // Return direct image URL for embedding
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export function getDriveThumbnailUrl(fileId: string, size: number = 400): string {
  // Return thumbnail URL
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`
}
