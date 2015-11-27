var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://lcy:lcy@localhost/questionaire');

app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.urlencoded({extended: false}));

var Question = require('./controllers/question');

app.get('/manage/questions', Question.listPage);
app.get('/manage/question/add', Question.addPage);
app.post('/manage/question/add', Question.add);
app.get('/data/questions', Question.list);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

var port = process.env.PORT || 8080;
app.listen(port);