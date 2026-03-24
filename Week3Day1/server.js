// 1️⃣ Import packages
const express = require("express"); 
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// 2️⃣ Create app
const app = express();               
app.use(express.json());   // Middleware to parse JSON

// 3️⃣ Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "A simple CRUD API for managing tasks with status workflow",
    },
    servers: [
      { url: "http://localhost:5000" }
    ]
  },
  apis: ["./server.js"], // Look for JSDoc comments in this file
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("Swagger docs available at http://localhost:5000/api-docs");

// 4️⃣ Tasks data
let tasks = [
  { id: 1, title: 'Learn Express', completed: false, status:'in progress' },
  { id: 2, title: 'Practice Javascript', completed: false, status: 'to review'},
  { id: 3, title: 'Watch tutorials', completed: false , status:'in progress'},
  { id: 4, title: 'Learn CSS', completed: true , status:'submitted'},
  { id: 5, title: 'Practice HTML', completed: true , status:'submitted'},
  { id: 6, title: 'Practice Express', completed: false, status:'in progress' },
];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Confirms that API is running
 *     responses:
 *       200:
 *         description: API running message
 */
app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

/**
 * @swagger
 * /getrequest:
 *   get:
 *     summary: Get all tasks
 *     description: Returns all tasks with title, completed, and status
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   title: Learn Express
 *                   completed: false
 *                   status: in progress
 *               message: Tasks fetched successfully
 */
app.get("/getrequest", (req, res) => {
  res.status(200).json({
    success: true,
    data: tasks,
    message: "Tasks fetched successfully"
  });
});

/**
 * @swagger
 * /postrequest:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: ["pending","in progress","to review","submitted","done"]
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Task created successfully
 */
app.post("/postrequest", (req, res) => {
  const { title, completed, status } = req.body;
  const allowedStatuses = [ "in progress", "to review", "submitted"];

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Title is required and must be a string"
    });
  }

  const taskStatus = status && allowedStatuses.includes(status)
    ? status
    : completed === true ? "done" : "pending";

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: completed === true, 
    status: taskStatus
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully"
  });
});
/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: null
 *               message: Task deleted successfully
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               message: Task not found
 */
app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Task not found"
    });
  }

  tasks.splice(taskIndex, 1); // Remove task from array

  res.status(200).json({
    success: true,
    data: null,
    message: "Task deleted successfully"
  });
});
/**
 * @swagger
 * /putrequest/{id}:
 *   put:
 *     summary: Update a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: ["pending","in progress","to review","submitted","done"]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
app.put("/putrequest/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Task not found"
    });
  }

  const { title, completed, status } = req.body;
  const allowedStatuses = ["pending", "in progress", "to review", "submitted", "done"];

  if (title && typeof title === "string") task.title = title;
  if (completed !== undefined) task.completed = completed === true;
  if (status && allowedStatuses.includes(status)) task.status = status;

  res.status(200).json({
    success: true,
    data: task,
    message: "Task updated successfully"
  });
});

/**
 * @swagger
 * /gettaskbyid/{id}:
 *   get:
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       404:
 *         description: Task not found
 */
app.get("/gettaskbyid/:id", (req,res) =>{
  const id= parseInt(req.params.id);
  const task= tasks.find( t => t.id === id);
  if (!task){
    return res.status(404).json({
      success:false,
      data:null,
      message:"Task not found"
    })
  }
  res.status(200).json({
    success: true, 
    data: task,
    message:"Task fetched successfully"
  })
});

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get task statistics
 *     description: Returns total tasks, completed tasks, pending tasks, and counts by status
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 */
app.get("/stats", (req, res) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  // Count tasks by status
  const statusCounts = {};
  tasks.forEach(task => {
    const s = task.status || "unknown";
    if (statusCounts[s]) {
      statusCounts[s]++;
    } else {
      statusCounts[s] = 1;
    }
  });

  return res.status(200).json({
    success: true,
    data: { total, completed, pending, statusCounts },
    message: "Stats fetched successfully"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    data: null,
    message: "Something went wrong!"
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});