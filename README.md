# WriteFlow Backend

## Overview

The backend of **WriteFlow** is responsible for handling server-side logic, managing API requests, and enabling integration with Google services. It acts as the bridge between the frontend and Google's APIs to provide seamless word count tracking and document management.

## Features

- **Google OAuth 2.0 Authentication:** Ensures secure and straightforward user authentication.
- **Google Drive Integration:** Fetches document metadata, including title, ID, and last modified date.
- **Google Docs Integration:** Retrieves document content to calculate word counts.

## Tech Stack

- **Node.js**: JavaScript runtime for backend logic.
- **Express.js**: Web framework for handling API routes and server functionality.
- **Google APIs**:
  - **Google OAuth 2.0** for authentication.
  - **Google Drive API** for document retrieval.
  - **Google Docs API** for accessing document content.
