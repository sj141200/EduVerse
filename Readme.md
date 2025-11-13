
# EduVerse

EduVerse is a teaching & learning web application prototype (full-stack) that supports courses, announcements, file uploads (backed by Azure Blob Storage), and assignments with submission + grading flows.

This repository contains two main projects:
- `eduverse-backend` — Node.js / Express API with CosmosDB and Azure Blob integration.
- `eduverse-frontend` — React + Vite single-page app for instructor and student dashboards.

**Status:** Active prototype. Core features implemented: course management, file uploads (with metadata persistence), secure SAS downloads, assignment creation, submission and grading.

**Quick Links (paths in repo)**
- Backend: `./eduverse-backend`
- Frontend: `./eduverse-frontend`

**Table of Contents**
- **Project Overview**
- **Tech Stack**
- **Local Setup**
- **Environment Variables**
- **Run (development)**
- **Key Endpoints & Frontend APIs**
- **Developer Notes & Next Steps**
- **Contributing**

## Project Overview

EduVerse lets instructors create courses, post announcements, upload files (stored in Azure Blob Storage) and create assignments. Students can join courses, download files, submit assignment files, and view grades.

Backend responsibilities
- Manage course data and assignments.
- Persist uploaded file metadata to an `UploadedFile` collection
- Upload file bytes to Azure Blob Storage and generate short-lived SAS URLs for secure downloads

Frontend responsibilities
- Instructor and student dashboards (React routes)
- Upload UI with progress, programmatic downloads preserving original filenames, and assignment management UI

## Tech Stack
- Backend: Node.js, Express, Azure Storage SDK
- Frontend: React, Vite, Axios
- Database: CosmosDB (self-hosted, Atlas, or local)
- Package manager: `pnpm` (project contains `pnpm-lock.yaml`)

## Local Setup

Prerequisites
- Node.js 22+ and `pnpm` installed
- Azure CosmosDB instance 
- Azure Storage account (or use local emulator) if you want file-upload/download features

Clone:

```bash
git clone https://github.com/sj141200/EduVerse.git
cd EduVerse
```

Install dependencies (backend + frontend):

```bash
cd eduverse-backend
npm install

cd ../eduverse-frontend
npm install
```

Or, install each package manually by `cd`ing into the project folders and running `npm install`.


## Run (development)

Start the backend:

```bash
cd eduverse-backend
npm install
# start the backend (use the script your project defines — common options:)
npm run dev   # or `npm start` if your backend uses that script
```

Start the frontend:

```bash
cd ../eduverse-frontend
npm install
npm run dev   # or `npm dev` where your npm client supports the shorthand
```

Open the app in the browser at the URL printed by Vite (usually `http://localhost:5173`).

## Key Endpoints & Frontend APIs

Some important backend endpoints (implemented in `routes/courses.js`):
- `GET /courses/:id` — course details (includes announcements, assignments, files)
- `GET /courses/:id/files` — list files (SAS URLs generated)
- `POST /courses/:id/files` — upload file (multipart) — stores metadata in `UploadedFile` and uploads to Azure
- `GET /courses/:id/files/:fileId/download` — generate SAS download URL (auth checked)
- `DELETE /courses/:id/files/:fileId` — delete blob + remove `UploadedFile` and course meta references
- `POST /courses/:id/assignments` — create assignment
- `PUT /courses/:id/assignments/:assignmentId` — update assignment metadata
- `POST /courses/:id/assignments/:assignmentId/submit` — submit assignment (file upload)
- `PUT /courses/:id/assignments/:assignmentId/submissions/:submissionId` — grade a submission

Frontend API wrappers are in `eduverse-frontend/src/api/*` (notably `assignments`, `files`, `auth`, `courses`). These helpers use `apiFetch` (Axios wrapper).

