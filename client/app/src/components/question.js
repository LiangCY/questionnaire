var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var Card = require('material-ui/lib/card').Card;
var CardTitle = require('material-ui/lib/card').CardTitle;
var CardText = require('material-ui/lib/card').CardText;
var TextField = require('material-ui/lib/text-field');
var RadioButtonGroup = require('material-ui/lib/radio-button-group');
var RadioButton = require('material-ui/lib/radio-button');
var Checkbox = require('material-ui/lib/checkbox');

var Question = React.createClass({
    handleInput: function (e) {
        var text = e.target.value;
        this.props.onTextChange({questionId: this.props.question._id, value: text});
    },
    handleSelect: function (e, selected) {
        this.props.onSelect({questionId: this.props.question._id, value: selected});
    },
    handleCheck: function (e, checked) {
        var value = e.target.value;
        this.props.onCheck({questionId: this.props.question._id, value: value, checked: checked});
    },
    render: function () {
        var answerArea;
        switch (this.props.question.type) {
            case 1:
                var options = this.props.question.options.map(function (option, i) {
                    return (
                        <RadioButton
                            key={option._id}
                            value={option._id}
                            label={option.content}
                            style={{marginBottom:12}}/>
                    );
                });
                answerArea =
                    <div>
                        <RadioButtonGroup name={this.props.question._id} onChange={this.handleSelect}>
                            {options}
                        </RadioButtonGroup>
                    </div>;
                break;
            case 2:
                options = this.props.question.options.map(function (option, i) {
                    return (
                        <Checkbox
                            key={option._id}
                            value={option._id}
                            label={option.content}
                            style={{marginBottom:12}}
                            onCheck={this.handleCheck}/>
                    );
                }.bind(this));
                answerArea = <div>{options}</div>;
                break;
            case 3:
                answerArea =
                    <div>
                        <TextField hintText={this.props.question.hint}
                                   fullWidth={true}
                                   onChange={this.handleInput}/>
                    </div>;
                break;
        }
        if (this.props.question.type == 1 && !this.props.answer ||
            this.props.question.type == 2 && (!this.props.answer || this.props.answer.length == 0)) {
            var titleStyle = {
                backgroundColor: Colors.orange300,
                transition:'background .5s'
            };
        } else {
            titleStyle = {
                backgroundColor: Colors.green300,
                transition:'background .5s'
            };
        }
        return (
            <Card style={{marginBottom:20}}>
                <CardTitle
                    titleStyle={{fontSize:18}}
                    title={'第'+(this.props.index+1)+'题'+(this.props.question.type==2?'（可多选）':'')}
                    style={titleStyle}
                    titleColor={Colors.white}/>
                <CardText>
                    <p style={{fontWeight:300,fontSize:18}}>
                        {this.props.question.content}
                    </p>
                    {answerArea}
                </CardText>
            </Card>
        );
    }
});

module.exports = Question;