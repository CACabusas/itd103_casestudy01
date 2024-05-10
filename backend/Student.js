const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    sex: {type: String, required: true, enum: ['Male', 'Female', 'Prefer not to say']},
    section: {type: String, required: true},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'teacher'}
})

const StudentModel = mongoose.model("student", StudentSchema)

module.exports = StudentModel;