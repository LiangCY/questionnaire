var url = location.href;
var questionnaireId = url.substring(url.lastIndexOf('/') + 1);
new Vue({
    el: '#main',
    data: {
        questionnaire: {},
        questions: [],
        errorMessage: '',
        questionsCount: 0,
        saving: false
    },
    ready: function () {
        var self = this;
        fetch('/data/questionnaire/' + questionnaireId)
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                if (!json.success) {
                    self.errorMessage = json.error;
                } else {
                    self.questionnaire = json.questionnaire;
                    self.questions = json.questions;
                    var selectedQuestions = self.questionnaire.questions;
                    self.questions.forEach(function (question) {
                        if (selectedQuestions.indexOf(question._id) >= 0) {
                            question.selected = true;
                        }
                    });
                    var count = 0;
                    self.questions.forEach(function (question) {
                        if (question.selected) {
                            count++;
                        }
                    });
                    self.questionsCount = count;
                }
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    },
    attached: function () {
        $('#deadline').datetimepicker({step: 5});
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
        saveQuestionnaire: function () {
            if (this.saving) {
                return;
            }
            if (this.questionnaire.title == '') {
                this.errorMessage = '请输入问卷标题';
                return;
            }
            this.errorMessage = '';
            var self = this;
            this.saving = true;
            this.questionnaire.questions = this.questions.filter(function (question) {
                return question.selected;
            }).map(function (question) {
                return question._id;
            });
            fetch('/manage/questionnaire/edit', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    questionnaire: this.questionnaire
                })
            })
                .then(function (response) {
                    return response.json()
                })
                .then(function (json) {
                    self.saving = false;
                    if (!json.success) {
                        self.errorMessage = json.error;
                    } else {
                        notie.alert(1, '保存成功!', 1);
                    }
                });
        },
        publishQuestionnaire: function () {
            if (this.saving) {
                return;
            }
            if (this.questionnaire.title == '') {
                this.errorMessage = '请输入问卷标题';
                return;
            }
            this.errorMessage = '';
            var self = this;
            this.saving = true;
            this.questionnaire.questions = this.questions.filter(function (question) {
                return question.selected;
            }).map(function (question) {
                return question._id;
            });
            this.questionnaire.isPublished = true;
            fetch('/manage/questionnaire/publish', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    questionnaire: this.questionnaire
                })
            })
                .then(function (response) {
                    return response.json()
                })
                .then(function (json) {
                    self.saving = false;
                    if (!json.success) {
                        self.errorMessage = json.error;
                    } else {
                        window.location.href = '/manage';
                    }
                });
        },
        deleteQuestionnaire: function () {
            var self = this;
            fetch('/data/questionnaire/' + questionnaireId, {method: 'delete'})
                .then(function (response) {
                    return response.json()
                })
                .then(function (json) {
                    if (!json.success) {
                        self.errorMessage = json.error;
                    } else {
                        window.location.href = '/manage';
                        history.replaceState('', '', '/manage');
                    }
                });
        }
    },
    computed: {
        fu: function (question) {
            console.log(question._id);
        }
    }
});