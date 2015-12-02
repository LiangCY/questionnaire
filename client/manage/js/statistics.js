var url = location.href;
var questionnaireId = url.substring(url.lastIndexOf('/') + 1);

new Vue({
    el: '#main',
    data: {questionnaire: {}},
    ready: function () {
        var self = this;
        fetch('/statistics/' + questionnaireId)
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                if (json.success) {
                    self.questionnaire = json.questionnaire;
                    var questions = self.questionnaire.questions;
                    questions.forEach(function (question) {
                        var data = [{
                            type: 'bar',
                            x: question.options.map(function (option) {
                                    return option.count;
                                })
                                .reverse(),
                            y: question.options.map(function (option, index) {
                                    return '选项' + (index + 1);
                                })
                                .reverse(),
                            text: question.options.map(function (option) {
                                    return option.content
                                })
                                .reverse(),
                            hoverinfo: 'x+text',
                            orientation: 'h'
                        }];
                        setTimeout(function () {
                            Plotly.newPlot(question._id, data, null, {displayModeBar: false});
                        }, 100);
                    });
                } else {
                    console.log(json.error);
                }
            })
            .catch(function (ex) {
                console.log(ex)
            });
    }
});
