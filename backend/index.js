const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
var cors = require('cors')
const StudentModel = require('./Student')
const ScoreModel = require('./Score')
const TeacherModel = require('./Teacher')
const AdminModel = require('./admin')

const app = express()
const port = 3001
const { Types } = require('mongoose');
const ObjectId = Types.ObjectId;
app.use(cors())
app.use(express.json())

// Generate secret key
const secretKey = crypto.randomBytes(16).toString('hex');

// Configure session middleware
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://127.0.0.1/itd103casestudy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Database connected'))
    .catch(err => console.log(err));

// Register
app.post('/register', async (req, res) => {
    try {
        const { name, sex, subject, username, password } = req.body;
        const existingUser = await TeacherModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new TeacherModel({ name, sex, subject, username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login route
app.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await TeacherModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.session.userId = user._id;
        res.json({ message: 'Login successful', teacherId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Fetch students by teacher ID
app.get('/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    try {
        // Query to find students where the teacher field matches the teacherId
        const students = await StudentModel.find({ teacher: teacherId });
        res.json(students);
    } catch (err) {
        res.json(err);
    }
});

// Search function
app.get('/:teacherId/searchstudent', async (req, res) => {
    const searchTerm = req.query.q;
    console.log('Search Term:', searchTerm);
    try {
        const student = await StudentModel.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Entry not found' });
    }
});

// Get student by ID
app.get('/:teacherId/getstudent/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    StudentModel.findById({ _id: studentId })
        .then(post => res.json(post))
        .catch(err => console.log(err))
})

// New student entry
app.post('/:teacherId/addstudent', async (req, res) => {
    try {
        const { teacherId } = req.params; // Extract teacherId from URL params
        const studentData = req.body;
        // Add the logged-in teacher's ID to the student data
        studentData.teacher = teacherId;
        // Create the new student entry
        const newStudent = await StudentModel.create(studentData);
        res.json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete student
app.delete('/:teacherId/deletestudent/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        await StudentModel.findByIdAndDelete(studentId);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Student info update
app.put('/:teacherId/updatestudent/:studentId', async (req, res) => {
    try {
        const { teacherId, studentId } = req.params; // Extract teacherId and studentId from URL params
        const { name, sex, section } = req.body; // Extract updated student data
        // Find the student by ID and ensure it belongs to the logged-in teacher
        const updatedStudent = await StudentModel.findOneAndUpdate(
            { _id: studentId, teacher: teacherId }, // Query to find the student
            { name, sex, section },
            { new: true } // Return the updated document
        );
        // Check if the student was found and updated
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found or access denied' });
        }
        res.json(updatedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get student scores by ID with aggregation
app.get('/:teacherId/getscore/:studentId', async (req, res) => {
    const { teacherId, studentId } = req.params;
    try {
        // Find the student by ID
        const student = await StudentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if the student's teacher ID matches the logged-in teacher's ID
        if (student.teacher.toString() !== teacherId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Find scores for the student
        const scores = await ScoreModel.find({ student: studentId });
        res.json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New score entry
app.post('/:teacherId/addscore/:studentId', async (req, res) => {
    try {
        const { teacherId, studentId } = req.params;
        const student = await StudentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const newScore = new ScoreModel({
            student: studentId,
            teacher: teacherId,
            event: req.body.event,
            score: req.body.score,
            totalscore: req.body.totalscore,
            date: new Date(req.body.date)
        });
        const score = await newScore.save();
        res.json(score);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Student score update
app.put('/:teacherId/updatescore/:studentId/:scoreId', async (req, res) => {
    const scoreId = req.params.scoreId;
    try {
        const updatedScore = await ScoreModel.findByIdAndUpdate(scoreId, req.body, { new: true });
        if (!updatedScore) {
            return res.status(404).json({ error: 'Score not found' });
        }
        res.json(updatedScore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a score entry
app.delete('/:teacherId/deletescore/:scoreId', async (req, res) => {
    try {
        const scoreId = req.params.scoreId;
        const deletedScore = await ScoreModel.findByIdAndDelete(scoreId);
        if (!deletedScore) {
            return res.status(404).json({ error: 'Score not found' });
        }
        res.json({ message: 'Score deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// - - - - - - - - - - A D M I N - - - - - - - - - - 


AdminModel.findOne({ username: 'admin' })
    .then(admin => {
        // If admin doesn't exist, create one
        if (!admin) {
            const hashedPassword = bcrypt.hashSync('trackit', 10);
            const newAdmin = new AdminModel({
                username: 'admin',
                password: hashedPassword
            });
            newAdmin.save()
                .then(() => console.log('Admin user created successfully'))
                .catch(error => console.error('Error creating admin user:', error));
        }
    })
    .catch(error => console.error('Error checking admin existence:', error));

// Admin login route
app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await AdminModel.findOne({ username });
        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.session.adminId = admin._id;
        req.session.isAdminLoggedIn = true; // Set the flag to true
        res.json({ message: 'Admin login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Admin logout route
app.get('/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Admin logged out successfully' });
    });
});

// Search function
app.get('/admin/adminsearch', async (req, res) => {
    const searchTerm = req.query.q;
    console.log('Search Term:', searchTerm);
    try {
        const students = await StudentModel.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        const teachers = await TeacherModel.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        res.json({ students, teachers }); // Combine results into one object and send once
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Entry not found' });
    }
});

// Get all teachers
app.get('/admin/teachers', async (req, res) => {
    try {
        const teachers = await TeacherModel.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get teacher by id
app.get('/admin/getteacher/:teacherId', (req, res) => {
    const teacherId = req.params.teacherId;
    TeacherModel.findById({ _id: teacherId })
        .then(post => res.json(post))
        .catch(err => console.log(err))
})

app.put('/admin/updateteacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { name, sex, subject, username, password } = req.body; // Extract existing data
        const updatedTeacher = await TeacherModel.findOneAndUpdate(
            { _id: teacherId },
            { name, sex, subject, username, password },
            { new: true }
        );
        if (!updatedTeacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(updatedTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete teacher
app.delete('/admin/teachers/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        await TeacherModel.findByIdAndDelete(teacherId);
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all students
app.get('/admin/students', async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get student by ID
app.get('/admin/getstudent/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    StudentModel.findById({ _id: studentId })
        .then(post => res.json(post))
        .catch(err => console.log(err))
})

// Update student by admin
app.put('/admin/:teacherId/updatestudent/:studentId', async (req, res) => {
    try {
        const { teacherId, studentId } = req.params; // Extract teacherId and studentId from URL params
        const { name, sex, section } = req.body; // Extract updated student data
        // Find the student by ID and ensure it belongs to the logged-in teacher
        const updatedStudent = await StudentModel.findOneAndUpdate(
            { _id: studentId, teacher: teacherId }, // Query to find the student
            { name, sex, section },
            { new: true } // Return the updated document
        );
        // Check if the student was found and updated
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found or access denied' });
        }
        res.json(updatedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete student
app.delete('/admin/deletestudent/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        await StudentModel.findByIdAndDelete(studentId);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
