new Vue({
    el: '#main',
    data: {
        title: '',
        questions: [],
        errorMessage: '',
        questionsCount: 0,
        adding: false
    },
    ready: function () {
        var self = this;
        fetch('/data/questions', {credentials: 'same-origin'})
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                if (!json.success) {
                    self.errorMessage = json.error;
                }
                self.questions = json.questions;
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    },
    methods: {
        countQuestions: function () {
            var count = 0;
            this.questions.forEach(function (question) {
                if (question.selected) {
                    count++;
                }
            });
            this.questionsCount = count;
        },
        addQuestionnaire: function () {
            if (this.adding) {
                return;
            }
            if (this.title == '') {
                this.errorMessage = '请输入问卷标题';
                return;
            }
            this.errorMessage = '';
            var self = this;
            this.adding = true;
            fetch('/manage/questionnaire/add', {
                credentials: 'same-origin',
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: this.title,
                    questions: this.questions.filter(function (question) {
                        return question.selected;
                    }).map(function (question) {
                        return question._id;
                    })
                })
            })
                .then(function (response) {
                    return response.json()
                })
                .then(function (json) {
                    self.adding = false;
                    if (!json.success) {
                        self.errorMessage = json.error;
                    } else {
                        window.location.href = '/manage';
                    }
                });
        }
    }
});