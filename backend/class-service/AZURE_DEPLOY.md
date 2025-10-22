# Deploying class-service to Azure App Service (outline)

1. Create an Azure App Service (Linux) and Web App for Containers or Node.js runtime.
2. Enable System Assigned Managed Identity for the App Service.
3. In Azure Key Vault, add a secret named 'COSMOS_CONN_STR' with your Cosmos DB connection string.
4. Grant the App Service's managed identity 'Secret/Get' access to the Key Vault.
5. In App Service configuration, set env var KEY_VAULT_NAME to your Key Vault name and COSMOS_DB_NAME/COSMOS_CONTAINER as needed.
6. Deploy via GitHub Actions or use Azure CLI: `az webapp up` or Docker push if using container.
