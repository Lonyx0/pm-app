require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware to parse JSON
app.use(express.json());

app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/projects', require('./Routes/projectsRoutes'));
app.use('/api/tasks', require('./Routes/tasksRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});