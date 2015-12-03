var url = location.href;
var questionId = url.substring(url.lastIndexOf('/') + 1);
new Vue({
    el: '#question',
    data: {
        question: {},
        options: [],
        errorMessage: '',
        saving: false
    },
    ready: function () {
        var self = this;
        fetch('/data/question/' + questionId, {credentials: 'same-origin'})
            .then(function (response) {
                return response.json()
            })
            .then(function (json) {
                self.question = json.question;
                self.options = json.options;
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            });
    },
    methods: {
        addOption: function () {
            this.options.push({
                content: ''
            });
        },
        deleteOption: function (index, option) {
            if (!option._id) {
                this.options.splice(index, 1);
                return;
            }
            var self = this;
            fetch('/data/option/' + option._id, {
                credentials: 'same-origin',
                method: 'delete'
            })
                .then(function (response) {
                    return response.json()
                })
                .then(function (json) {
                    if (json.success) {
                        self.options = self.options.filter(function (option) {
                            return option._id != json.option._id;
                        });
                    } else {
                        self.errorMessage = json.error;
                    }
                });
        },
        submit: function () {
            if (this.saving) {
                return;
            }
            if (this.question.content == '') {
                this.errorMessage = '题目内容不能为空';
                return;
            }
            var options = this.options;
            for (var i = 0, len = options.length; i < len; i++)
                if (options[i].content == '') {
                    this.errorMessage = '选项内容不能为空';
                    return;
                }
            this.errorMessage = '';
            this.saving = true;
            var self = this;
            fetch('/data/question/' + questionId, {
                credentials: 'same-origin',
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: this.question,
                    options: this.options
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
        deleteQuestion: function () {
            var self = this;
            fetch('/data/question/' + questionId, {
                credentials: 'same-origin',
                method: 'delete'
            })
                .then(function (response) {
                    return response.json()
                })
                .then(function (json) {
                    if (!json.success) {
                        self.errorMessage = json.error;
                    } else {
                        window.location.href = '/manage/questions';
                        history.replaceState('', '', '/manage/questions');
                    }
                });
        }
    }
});