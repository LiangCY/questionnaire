var url = location.href;
var questionnaireId = url.substring(url.lastIndexOf('/') + 1);

new Vue({
    el: '#main',
    data: {questionnaire: {}},
    ready: function () {
        var self = this;
        fetch('/statistics/' + questionnaireId, {credentials: 'same-origin'})
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                if (json.success) {
                    self.questionnaire = json.questionnaire;
                    var questions = self.questionnaire.questions;
                    questions.forEach(function (question) {
                        var optionsCount = 0;
                        question.options.forEach(function (option) {
                            optionsCount += option.count;
                        });
                        question.optionsCount = optionsCount;
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
                                    return option.content;
                                })
                                .reverse(),
                            hoverinfo: 'text',
                            orientation: 'h'
                        }];
                        var layout = {
                            font: {
                                size: 14
                            },
                            autosize: false,
                            height: question.options.length * 50 + 40,
                            margin: {
                                l: 50,
                                r: 50,
                                b: 20,
                                t: 20,
                                pad: 4
                            }
                        };
                        setTimeout(function () {
                            Plotly.newPlot(question._id, data, layout, {displayModeBar: false});
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
