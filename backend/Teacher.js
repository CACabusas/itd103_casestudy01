const mongoose = require('mongoose')

const TeacherSchema = new mongoose.Schema({
    name: {type: String, required: true},
    sex: {type: String, required: true, enum: ['Male', 'Female', 'Prefer not to say']},
    subject: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
})

const TeacherModel = mongoose.model("teacher", TeacherSchema)

module.exports = TeacherModel;