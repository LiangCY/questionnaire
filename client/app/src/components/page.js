var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var $ = require('jquery');
var Title = require('./title');
var Question = require('./question');

var Page = React.createClass({
    getInitialState: function () {
        return {answers: {}}
    },
    componentWillReceiveProps: function (nextProps) {
        var answers = _.clone(this.state.answers);
        nextProps.questions.forEach(function (question) {
            switch (question.type) {
                case 0:
                    answers[question._id] = '';
                    break;
                case 1:
                    answers[question._id] = '';
                    break;
                case 2:
                    answers[question._id] = [];
                    break;
            }
        }.bind(this));
        this.setState({answers: answers});
    },
    handleTextChange: function (answer) {
        var answers = _.clone(this.state.answers);
        answers[answer.questionId] = answer.value;
        this.setState({answers: answers});
    },
    handleSelect: function (answer) {
        var answers = _.clone(this.state.answers);
        answers[answer.questionId] = answer.value;
        this.setState({answers: answers});
    },
    handleCheck: function (action) {
        var answers = _.clone(this.state.answers);
        if (action.checked) {
            if (answers[action.questionId].indexOf(action.value) < 0)
                answers[action.questionId].push(action.value);
        } else {
            var index = answers[action.questionId].indexOf(action.value);
            if (index >= 0) {
                answers[action.questionId].splice(index, 1);
            }
        }
        this.setState({answers: answers});
    },
    handleSubmit: function () {
        var answers = this.state.answers;
        for (var i = 0; i < this.props.questions.length; i++) {
            var question = this.props.questions[i];
            if (question.type == 1 && !answers[question._id]) {
                var scrollTop = ReactDOM.findDOMNode(this.refs[question._id]).offsetTop - 80;
                $(document.body).animate({scrollTop: scrollTop}, 800);
                return;
            }
            if (question.type == 2 && answers[question._id].length == 0) {
                scrollTop = ReactDOM.findDOMNode(this.refs[question._id]).offsetTop - 80;
                $(document.body).animate({scrollTop: scrollTop}, 800);
                return;
            }
        }
        this.props.onSubmit(this.state.answers);
    },
    render: function () {
        var self = this;
        var questions = this.props.questions.map(function (question, i) {
            return <Question key={question._id} question={question}
                             index={i}
                             ref={question._id}
                             answer={self.state.answers[question._id]}
                             onTextChange={self.handleTextChange}
                             onCheck={self.handleCheck}
                             onSelect={self.handleSelect}/>
        });
        return (
            <div>
                <Title title={this.props.title}/>
                <div className="ui container" style={{paddingTop:96}}>
                    {questions}
                    <button className="ui teal large button"
                            style={{marginBottom:20}}
                            onClick={this.handleSubmit}>
                        提交问卷
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = Page;