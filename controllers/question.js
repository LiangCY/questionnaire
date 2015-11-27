var path = require('path');
var Question = require('../models/question');

exports.listPage = function (req, res) {
    res.sendFile(path.join(__dirname, '../client/manage/questions.html'));
};

exports.list = function (req, res) {
    Question.find()
        .select('content type')
        .exec(function (err, questions) {
            if (err) {
                return res.json({
                    success: false,
                    error: err.message
                });
            }
            res.json({
                success: true,
                questions: questions
            });
        });
};

exports.addPage = function (req, res) {
    res.sendFile(path.join(__dirname, '../client/manage/add_question.html'));
};

exports.add = function (req, res, next) {
    var question = new Question(req.body);
    question.save(function (err, question) {
        if (err) {
            return next(err);
        }
        res.redirect('/manage/question/' + question._id);
    });
};