// discussion-service - Express app (starter)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const { CosmosClient } = require('@azure/cosmos');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// Function to obtain Cosmos connection from Key Vault (if available), otherwise fallback to env var
async function getCosmosClient() {
  const kvName = process.env.KEY_VAULT_NAME;
  let connStr = process.env.COSMOS_CONN_STR; // dev fallback
  if (kvName) {
    try {
      const url = `https://${kvName}.vault.azure.net`;
      const credential = new DefaultAzureCredential();
      const client = new SecretClient(url, credential);
      const secret = await client.getSecret('COSMOS_CONN_STR');
      connStr = secret.value;
      console.log('Fetched COSMOS_CONN_STR from Key Vault');
    } catch (err) {
      console.error('Failed to fetch secret from Key Vault, falling back to env var:', err.message);
    }
  }
  if (!connStr) throw new Error('Cosmos connection string not set');
  const cosmos = new CosmosClient(connStr);
  return cosmos;
}

// Initialize Cosmos DB client and container reference
let container;
(async () => {
  try {
    const cosmos = await getCosmosClient();
    const dbName = process.env.COSMOS_DB_NAME || 'online_learning';
    const containerName = process.env.COSMOS_CONTAINER || 'discussion_service_container';
    const { database } = await cosmos.databases.createIfNotExists({ id: dbName });
    const { container: cont } = await database.containers.createIfNotExists({ id: containerName });
    container = cont;
    console.log('Connected to Cosmos DB:', dbName, containerName);
  } catch (err) {
    console.error('Cosmos initialization error:', err.message);
  }
})();

// Simple health route
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'discussion-service' }));

// Example CRUD endpoints (modify per service)
app.post('/items', async (req, res) => {
  try {
    const item = req.body;
    const created = await container.items.create(item);
    res.status(201).json(created.resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const query = 'SELECT * FROM c';
    const result = await container.items.query(query).fetchAll();
    res.json(result.resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log('discussion-service listening on ' + port));
