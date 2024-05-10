const mongoose = require('mongoose')

const ScoreSchema = new mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'student'},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'teacher'},
    event: {type: String, required: true},
    score: {type: Number, required: true},
    totalscore: {type: Number, required: true},
    date: {type: Date, required: true},
})

const ScoreModel = mongoose.model("score", ScoreSchema)

module.exports = ScoreModel;