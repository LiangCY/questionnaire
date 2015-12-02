var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Answer = mongoose.model('Answer', new Schema({
    user: ObjectId,
    questionnaire: {
        type: ObjectId,
        ref: 'Questionnaire'
    },
    content: String
}));

module.exports = Answer;