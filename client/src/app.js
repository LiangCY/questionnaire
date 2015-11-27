var React = require('react');
var ReactDOM = require('react-dom');
var data = require('./data');
var Page = require('./components/page');

ReactDOM.render(
    <Page title={'问卷调查'} questions={data.questions}/>,
    document.getElementById('example')
);