'use strict';

angular.module('mainApp')
    .factory("menuService", ['$http', function ($http) {
        var getData = function(){
            return $http({ cache: false, headers: { 'Cache-Control': 'no-cache' }, method: "Get", url: "/api/v1/scam_training/get_student_info"}).then(function(result){
                return result.data});
        };
        return { getData: getData };
    }])
    .factory("trainingService", ['$http', '$rootScope', function ($http, $rootScope) {
        return {
            postPageRead: function (oldState){
                var states = oldState.split('.');
                if(states.length < 2 || states[0] == 'quiz' || states[0] == 'achievement' ){ return }
                var page = {
                    'training_section_name': states[0],
                    'training_page_action': states[1]
                };
                page = {page:page};
                $http({ cache: false, headers: { 'Cache-Control': 'no-cache' }, method: "POST", url: "/api/v1/scam_training/page_read", data: page}).then(function(data){
                    return '';
                });
                return '';
            }
        };
    }]);
