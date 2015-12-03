var React = require('react');
var Colors = require('material-ui/lib/styles/colors');

var Title = React.createClass({
    render: function () {
        return (
            <div
                style={{backgroundColor:Colors.cyan500,
                height:64,
                position:'fixed',
                width:'100%',
                top:0,
                right:0,
                zIndex:4}}>
                <span style={{
                color:'#FFFFFF',
                fontSize:26,
                fontWeight:300,
                left:60,
                position:'absolute',
                top:20
                }}>{this.props.title}</span>
            </div>
        );
    }
});

module.exports = Title;