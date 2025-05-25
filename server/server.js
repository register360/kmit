require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware - MUST come first
app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(cors({
  origin: ['http://localhost:3000', 'https://register360.github.io'],
  methods: ['GET', 'POST']
}));

// Serve static files (if frontend is in same project)
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kmit_portal";

mongoose.connect(DB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  rollno: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 10
  },
  password: { type: String, required: true, minlength: 6 },
  branch: { 
    type: String, 
    required: true,
    enum: ['CSE', 'CSE-AI&ML', 'IT']
  },
  createdAt: { type: Date, default: Date.now }
});

// Password hashing middleware
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Student = mongoose.model('Student', studentSchema);

// Routes
app.post('/submit', async (req, res) => {
   console.log("Raw request body:", req.body); // Add this line
  try {
    const { name, number, rollno, password, branch } = req.body;
    console.log("Parsed fields:", {name, number, rollno, password, branch});

    // Validation
    if (!name || !number || !rollno || !password || !branch) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if student exists
    const existingStudent = await Student.findOne({ rollno });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this RollNo already exists' });
    }

    // Create new student
    const newStudent = new Student({
      name,
      mobile: number,
      rollno: rollno.toUpperCase(),
      password,
      branch
    });

    await newStudent.save();
    
    // Remove password from response
    const studentData = newStudent.toObject();
    delete studentData.password;

    res.status(201).json({ 
      success: true,
      message: 'Student registered successfully',
      data: studentData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Additional API Endpoints
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}, '-password -__v');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching students' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  });
