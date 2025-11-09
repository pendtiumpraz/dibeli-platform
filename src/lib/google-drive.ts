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
    const account = await prisma.account.findFirst({
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

    console.log('OAuth tokens found, creating Drive client...')

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + '/api/auth/callback/google'
    )

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    })

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
    console.log(`Uploading ${fileName} (${file.size} bytes, ${file.type})`)
    
    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Create readable stream from buffer
    const { Readable } = await import('stream')
    const stream = Readable.from(buffer)

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink, thumbnailLink',
    })

    // Make file publicly accessible
    if (response.data.id) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })
    }

    return {
      id: response.data.id!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink!,
      thumbnailLink: response.data.thumbnailLink!,
    }
  } catch (error) {
    console.error('Error uploading to Drive:', error)
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
