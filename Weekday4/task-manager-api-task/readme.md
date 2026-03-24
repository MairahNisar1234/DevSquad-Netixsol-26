# Task Management API

A secure RESTful backend service for managing personal tasks. This API provides user authentication, data isolation, and full CRUD operations.

## Features

- **User Authentication:** JWT-based login and registration.
- **Data Privacy:** Users can only access and modify their own tasks.
- **Filtering:** Built-in support for filtering tasks by completion status.
- **Security:** Password hashing and input validation.

## Setup Instructions

### 1. Prerequisites

- Node.js installed on your machine.
- A MongoDB Atlas account for database hosting.

### 2. Configuration

Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key 
### 3. Running the App

```bash
# Install dependencies
npm install

# Start the server
node src/server.js