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

    let parentFolder: string
    
    if (rootFolderId) {
      // Use existing folder by ID - THIS IS THE ROOT, store folders go directly inside!
      console.log(`Using existing root folder ID: ${rootFolderId}`)
      console.log(`Store folders will be created directly inside this folder`)
      parentFolder = rootFolderId
    } else {
      // Auto-create structure: dibeli.my.id → toko → stores
      const existingRoot = await findFolder(drive, rootFolderName)
      let rootFolder: string
      
      if (existingRoot) {
        rootFolder = existingRoot
        console.log(`Found existing root folder: ${rootFolderName}`)
      } else {
        rootFolder = await createFolder(drive, rootFolderName, null)
        console.log(`Created root folder: ${rootFolderName}`)
      }

      // Create stores subfolder
      let storesFolder = await findFolder(drive, storesFolderName, rootFolder)
      if (!storesFolder) {
        storesFolder = await createFolder(drive, storesFolderName, rootFolder)
        console.log(`Created stores folder: ${storesFolderName}`)
      }
      
      parentFolder = storesFolder
    }

    // Check if store folder exists (directly in parentFolder)
    let storeFolder = await findFolder(drive, storeName, parentFolder)
    if (!storeFolder) {
      storeFolder = await createFolder(drive, storeName, parentFolder)
      console.log(`Created store folder: ${storeName}`)
    } else {
      console.log(`Using existing store folder: ${storeName}`)
    }

    // Check if product folder exists (for edit scenario)
    let productFolder = await findFolder(drive, productName, storeFolder)
    if (!productFolder) {
      productFolder = await createFolder(drive, productName, storeFolder)
      console.log(`Created product folder: ${productName}`)
    } else {
      console.log(`Using existing product folder: ${productName}`)
    }

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

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    }

    console.log('☁️ Uploading to Google Drive...')
    console.log(`   - Folder ID: ${folderId}`)
    console.log(`   - File name: ${fileName}`)
    console.log(`   - MimeType: ${file.type}`)
    console.log(`   - Buffer size: ${buffer.length} bytes`)
    
    // Create axios-compatible config for upload
    const axios = require('axios')
    const FormData = require('form-data')
    
    // Get auth token from drive client
    const auth = (drive as any).context._options.auth
    const token = await auth.getAccessToken()
    
    console.log('   - Got access token for upload')
    
    // Create multipart form data
    const form = new FormData()
    
    // Add metadata part
    form.append('metadata', JSON.stringify({
      name: fileName,
      parents: [folderId],
      mimeType: file.type,
    }), {
      contentType: 'application/json; charset=UTF-8',
    })
    
    // Add file part
    form.append('file', buffer, {
      filename: fileName,
      contentType: file.type,
    })
    
    console.log('   - Uploading via multipart/form-data...')
    
    // Upload using axios directly
    const uploadResponse = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink,thumbnailLink',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token.token}`,
        },
      }
    )
    
    const response = {
      data: uploadResponse.data
    }
    
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
  // Use thumbnail URL which works better for display
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
}

export function getDriveThumbnailUrl(fileId: string, size: number = 400): string {
  // Return thumbnail URL
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`
}
