import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";
import { getSecret } from './keyVault.js'

// Helper to interact with Azure Blob Storage. Will try env vars first,
// and fall back to Azure Key Vault secrets when available.
let account = "";
let key = "";
let containerName = process.env.AZURE_STORAGE_CONTAINER || process.env.STORAGE_CONTAINER || 'files';

let sharedKeyCredential = null;
let blobServiceClient = null;

async function ensureClient() {
  if (blobServiceClient && sharedKeyCredential) return;
  // try to fetch from Key Vault if env vars are missing
  try {
    if (!account) {
      account = await getSecret('STORAGEACCOUNT').catch(() => null);
    }
    if (!key) {
      key = await getSecret('STORAGEACCESSKEY').catch(() => null);
    }
  } catch (e) {
    console.warn('Failed to retrieve Azure storage credentials from Key Vault', e && (e.message || e));
  }

  if (!account || !key) {
    // not configured yet
    return;
  }

  try {
    sharedKeyCredential = new StorageSharedKeyCredential(account, key);
    blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
  } catch (e) {
    console.error('Failed to create Azure Blob client', e && (e.message || e));
  }
}

async function uploadBuffer(buffer, blobName, contentType) {
  await ensureClient();
  if (!blobServiceClient) throw new Error('Azure Blob client not configured');
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadRes = await blockBlobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType || 'application/octet-stream' } });
  return { url: blockBlobClient.url, etag: uploadRes.etag };
}

async function deleteBlob(blobName) {
  await ensureClient();
  if (!blobServiceClient) throw new Error('Azure Blob client not configured');
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const client = containerClient.getBlobClient(blobName);
  await client.deleteIfExists();
  return true;
}

async function generateDownloadSas(blobName, expiresInMinutes = 60) {
  await ensureClient();
  if (!sharedKeyCredential) throw new Error('Azure storage not configured for SAS');
  const permissions = BlobSASPermissions.parse('r');
  const startsOn = new Date();
  const expiresOn = new Date(startsOn.valueOf() + expiresInMinutes * 60 * 1000);
  const sas = generateBlobSASQueryParameters({ containerName, blobName, permissions, startsOn, expiresOn }, sharedKeyCredential).toString();
  const url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}?${sas}`;
  return url;
}

export { uploadBuffer, deleteBlob, generateDownloadSas };
