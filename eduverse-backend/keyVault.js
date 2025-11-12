
// keyVault.js
// Utility to fetch secrets from Azure Key Vault

const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

async function getSecret(secretName) {
  const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL;
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(keyVaultUrl, credential);
  try {
    const secret = await client.getSecret(secretName);
    return secret.value;
  } catch (err) {
    console.error(`Error fetching secret ${secretName}:`, err);
    throw err;
  }
}

module.exports = { getSecret };
