var url = location.href;
var questionnaireId = url.substring(url.lastIndexOf('/') + 1);

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var data = require('./data');
var Page = require('./components/page');

var App = React.createClass({
    getInitialState: function () {
        var self = this;
        $.ajax({
            url: '/user/questionnaire/' + questionnaireId,
            success: function (data) {
                if (data.success) {
                    self.setState({
                        title: data.title,
                        questions: data.questions
                    });
                }
            }
        });
        return {
            title: '',
            questions: []
        };
    },
    render: function () {
        return <Page title={this.state.title} questions={this.state.questions}/>;
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('example')
);