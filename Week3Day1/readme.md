# Task Manager API

A simple **CRUD API** built with **Node.js and Express** for managing tasks with a status workflow.

## Features
- Create tasks
- Get all tasks
- Get task by ID
- Update tasks
- Delete tasks
- View task statistics
- API documentation using **Swagger**

## Technologies Used
- Node.js
- Express.js
- Swagger (swagger-jsdoc, swagger-ui-express)
- Postman (for API testing)

## Installation

1. Clone the repository or download the project.

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

Server will run on:

```
http://localhost:5000
```

## API Documentation

Swagger documentation is available at:

```
http://localhost:5000/api-docs
```

You can view and test all API endpoints there.

## API Endpoints

### Get all tasks
```
GET /getrequest
```

### Create a task
```
POST /postrequest
```

Example body:

```json
{
  "title": "New Task",
  "completed": false,
  "status": "in progress"
}
```

### Update a task
```
PUT /putrequest/{id}
```

### Delete a task
```
DELETE /delete/{id}
```

### Get task by ID
```
GET /gettaskbyid/{id}
```

### Task statistics
```
GET /stats
```

Returns:
- total tasks
- completed tasks
- pending tasks
- task count by status

## Testing

API endpoints can be tested using:

- **Postman**
- **Swagger UI**

Import the provided **Postman Collection JSON** to test all endpoints easily.

## Author
Internship Task – Task Manager API