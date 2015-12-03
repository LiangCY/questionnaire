var path = require('path');
var async = require('async');
var _ = require('underscore');
var Question = require('../models/question');
var Option = require('../models/option');

exports.listPage = function (req, res) {
    res.sendFile(path.join(__dirname, '../view/manage/questions.html'));
};

exports.addPage = function (req, res) {
    res.sendFile(path.join(__dirname, '../view/manage/add_question.html'));
};

exports.editPage = function (req, res) {
    res.sendFile(path.join(__dirname, '../view/manage/edit_question.html'));
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

exports.detail = function (req, res) {
    var questionId = req.params.question;
    Question.findById(questionId)
        .select('content type')
        .exec(function (err, question) {
            if (err) {
                return res.json({
                    success: false,
                    error: err.message
                });
            }
            if (!question) {
                return res.json({
                    success: false,
                    error: 'Question not found'
                });
            }
            Option.find({question: question})
                .select('content')
                .exec(function (err, options) {
                    res.json({
                        success: true,
                        question: question,
                        options: options
                    });
                });
        });
};

exports.edit = function (req, res) {
    var question = req.body.question;
    var options = req.body.options;
    async.series([
        function (callback) {
            Question.findById(question._id)
                .exec(function (err, _question) {
                    if (_question) {
                        var newQuestion = _.extend(_question, question);
                        newQuestion.save(function (err, question) {
                            callback(err, question);
                        });
                    }
                })
        },
        function (callback) {
            async.each(options, function (option, callback) {
                if (option._id) {
                    Option.findOneAndUpdate({
                        _id: option._id,
                        question: question._id
                    }, {
                        $set: {
                            content: option.content
                        }
                    }, function (err) {
                        callback(err);
                    });
                } else {
                    var newOption = new Option({
                        content: option.content,
                        question: question._id
                    });
                    newOption.save(function (err) {
                        callback(err)
                    });
                }
            }, function (err) {
                callback(err);
            });
        }
    ], function (err, results) {
        if (err) {
            return res.json({
                success: false,
                error: err.message
            });
        }
        res.json({
            success: true
        });
    });
};

exports.delete = function (req, res) {
    var questionId = req.params.question;
    Question.findByIdAndRemove(questionId, function (err, question) {
        if (err) {
            return res.json({
                success: false,
                error: err.message
            });
        }
        if (!question) {
            return res.json({
                success: false,
                error: 'Question not found'
            });
        }
        Option.find({question: questionId})
            .remove(function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        error: err.message
                    });
                }
                res.json({
                    success: true
                });
            });
    });
};