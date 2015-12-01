var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Questionnaire = mongoose.model('Questionnaire', new Schema({
    title: {
        type: String,
        required: true
    },
    questions: [{
        type: ObjectId,
        ref: 'Question'
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    publishAt: Date,
    deadline: Date
}));

module.exports = Questionnaire;