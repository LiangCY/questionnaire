new Vue({
    el: '#main',
    data: {
        questionnaires: []
    },
    ready: function () {
        var self = this;
        fetch('/data/questionnaires', {credentials: 'same-origin'})
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                self.questionnaires = json.questionnaires;
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    }
});