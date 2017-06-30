'use strict';

angular.module('mainApp')
    .factory("quizService",['$http', function QuizFactory($http) {
        return {
            getRandomQuizzes: function (section) {
                return $http({ cache: false, headers: { 'Cache-Control': 'no-cache' }, method: "GET", url: "/api/v1/quizzes/get_quizzes/" + section});
           },
            postAnswers: function (answers){
                return $http({ cache: false, headers: { 'Cache-Control': 'no-cache' }, method: "POST", url: "/api/v1/quizzes/save_answers", data: answers});
            }
        };
    }]);
