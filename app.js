var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/questionnaire');

app.use(session({
    secret: 'questionnaire',
    cookie: {maxAge: 1000 * 60 * 60 * 3},
    store: new MongoStore({
        url: 'mongodb://localhost/questionnaire',
        collection: 'sessions'
    }),
    resave: true,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var Questionnaire = require('./controllers/questionnaire');
var Question = require('./controllers/question');
var Option = require('./controllers/option');
var Answer = require('./controllers/answer');
var Admin = require('./controllers/admin');


app.get('/', Admin.homePage);
app.get('/manage/login', Admin.loginPage);
app.post('/manage/login', Admin.login);
app.get('/manage/logout', Admin.loginRequired, Admin.logout);
app.get('/manage', Admin.loginRequired, Questionnaire.listPage);
app.get('/manage/questionnaire/add', Admin.loginRequired, Questionnaire.addPage);
app.post('/manage/questionnaire/add', Admin.loginRequired, Questionnaire.add);
app.post('/manage/questionnaire/edit', Admin.loginRequired, Questionnaire.edit);
app.post('/manage/questionnaire/publish', Admin.loginRequired, Questionnaire.publish);
app.get('/manage/questionnaire/:questionnaire', Admin.loginRequired, Questionnaire.editPage);
app.get('/manage/questions', Admin.loginRequired, Question.listPage);
app.get('/manage/question/add', Admin.loginRequired, Question.addPage);
app.get('/manage/question/:question', Admin.loginRequired, Question.editPage);
app.post('/manage/question/add', Admin.loginRequired, Question.add);
app.get('/data/questionnaires', Admin.loginRequired, Questionnaire.list);
app.get('/data/questionnaire/:questionnaire', Admin.loginRequired, Questionnaire.detail);
app.get('/data/questions', Admin.loginRequired, Question.list);
app.get('/data/question/:question', Admin.loginRequired, Question.detail);
app.post('/data/question/:question', Admin.loginRequired, Question.edit);
app.delete('/data/questionnaire/:questionnaire', Admin.loginRequired, Questionnaire.delete);
app.delete('/data/question/:question', Admin.loginRequired, Question.delete);
app.delete('/data/option/:option', Admin.loginRequired, Option.delete);

app.get('/questionnaire/:questionnaire', Answer.indexPage);
app.post('/questionnaire/:questionnaire', Answer.submit);
app.get('/user/questionnaire/:questionnaire', Answer.questionnaireData);
app.get('/result/:questionnaire', Answer.resultPage);
app.get('/statistics/:questionnaire', Answer.statistics);

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
console.log('listen port ======== ' + port)
app.listen(port);