# EduVerse

## Overview
This project is a cloud-based e-learning platform built using Microsoft Azure services. It provides a scalable, secure, and user-friendly system for students and instructors to manage courses, video lectures, and assessments.

## Features
- User authentication with Azure AD B2C
- Course creation and enrollment
- Video streaming from Azure Blob Storage
- Quiz and assignment management
- Student progress dashboard using Power BI
- Deployment on Azure App Service with CI/CD pipeline
- Database: Azure SQL Database and Azure Cosmos DB (Mongo API)
- Role-based access control for students and instructors

## Architecture
The platform uses Microservices + Event-Driven Architecture for scalability and fault-tolerance.

Frontend (React) → API Gateway → Microservices (User, Course, Payment)
                                  ↓
                          Azure SQL + Cosmos DB + Blob Storage

## Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React.js + Tailwind CSS + Azure Static Web Apps |
| Backend | Node.js / .NET Core + Azure App Service |
| Database | Azure SQL + Cosmos DB |
| Storage | Azure Blob Storage |
| Analytics | Azure Synapse + Power BI |
| CI/CD | GitHub Actions + Azure DevOps |

## Installation and Setup
Clone the repository:
```bash
cd EduVerse

npm install

npm start

Deploy to Azure:

Create a resource group

Deploy backend to Azure App Service

Deploy frontend to Azure Static Web Apps

Contributors
Shubham Jindal	Frontend Development (React, UI, Azure Integration)
Anurag Samota Backend Development (APIs, Database, Deployment)
