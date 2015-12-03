new Vue({
    el: '#main',
    data: {
        questions: []
    },
    ready: function () {
        var self = this;
        fetch('/data/questions', {credentials: 'same-origin'})
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                self.questions = json.questions;
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    }
});