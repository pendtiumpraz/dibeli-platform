import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function getDriveClient() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error('Not authenticated')
  }

  // Get user's OAuth tokens from database
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: 'google',
    },
  })

  if (!account?.access_token) {
    throw new Error('No Google access token found')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  )

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  })

  return google.drive({ version: 'v3', auth: oauth2Client })
}

export async function createFolderStructure(storeName: string, productName: string) {
  const drive = await getDriveClient()

  try {
    // Check if root folder exists
    let rootFolder = await findFolder(drive, 'dibeli.my.id')
    if (!rootFolder) {
      rootFolder = await createFolder(drive, 'dibeli.my.id', null)
    }

    // Check if toko folder exists
    let tokoFolder = await findFolder(drive, 'toko', rootFolder)
    if (!tokoFolder) {
      tokoFolder = await createFolder(drive, 'toko', rootFolder)
    }

    // Check if store folder exists
    let storeFolder = await findFolder(drive, storeName, tokoFolder)
    if (!storeFolder) {
      storeFolder = await createFolder(drive, storeName, tokoFolder)
    }

    // Create product folder
    const productFolder = await createFolder(drive, productName, storeFolder)

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
    // Convert File to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    }

    const media = {
      mimeType: file.type,
      body: require('stream').Readable.from(buffer),
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
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
