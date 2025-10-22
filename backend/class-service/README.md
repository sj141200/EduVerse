# class-service

Starter microservice for the Online Learning Platform.
This service is intended to run as an independent Azure App Service and connect to Azure Cosmos DB for storage.
Secrets should be retrieved from Azure Key Vault using a Managed Identity in production.

## Quick start (local)
1. Copy `.env.example` to `.env` and fill values for local development (only for dev; in production use Key Vault).
2. Install dependencies: `npm install`
3. Start: `npm run dev` (requires nodemon) or `npm start`

## Key Vault pattern (production)
- Grant the App Service a System Assigned Managed Identity.
- In Key Vault, add a secret named `COSMOS_CONN_STR` with your Cosmos DB connection string.
- Grant the App Service's managed identity 'Secret/Get' access to the Key Vault.
- In App Service configuration, set env var KEY_VAULT_NAME to your Key Vault name and COSMOS_DB_NAME/COSMOS_CONTAINER as needed.
