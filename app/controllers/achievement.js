'use strict';

angular.module('mainApp').controller('AchievementController', ['$scope', '$uibModal', 'achievementService', '$rootScope',
    function($scope, $uibModal, achievementService, $rootScope) {
        var achieve = this;
        $rootScope.is_thank_you_page = false;
        $scope.navigation.breadcrumb = [
            {
                'name': 'Achievements',
                'href': '/achievement'
            }
        ];
        achievementService.student_achieve().success(function(response){
            achieve.student_achieve = [];
            achieve.current_score = 0;
            achieve.pass_score = response.pass_score;

            angular.forEach(response.student_score, function(value, key) {
                achieve.current_score += value.correct_count;
                switch(value.section) {
                    case 'home':
                        achieve.student_achieve.push({
                            type: 'home',
                            rank: value.correct_count,
                            title: "Lisa's Leader </br> Award",
                            desc: "Complete the <br>Lisa's Leader questions",
                            href: 'quiz.home'
                        });
                        break;
                    case 'definitions':
                        achieve.student_achieve.push({
                            type: 'definitions',
                            rank: value.correct_count,
                            title: "Tech Talk </br> Award",
                            desc: "Complete the <br>Tech Talk questions",
                            href: 'quiz.definitions'
                        });
                        break;
                    case 'sender':
                        achieve.student_achieve.push({
                            type: 'sender',
                            rank: value.correct_count,
                            title: "Swindling Sender </br> Level 1",
                            desc: "Complete the <br>Swindling Sender questions",
                            href: 'quiz.sender'
                        });
                        break;
                    case 'content':
                        achieve.student_achieve.push({
                            type: 'content',
                            rank: value.correct_count,
                            title: "Curious Content </br> Level 1",
                            desc: "Complete the <br>Curious Content questions",
                            href: 'quiz.content'
                        });
                        break;
                    case 'action':
                        achieve.student_achieve.push({
                            type: 'action',
                            rank: value.correct_count,
                            title: "Actionable Emails </br> Level 1",
                            desc: "Complete the <br>Actionable Emails questions",
                            href: 'quiz.action'
                        });
                        break;
                    case 'manage':
                        achieve.student_achieve.push({
                            type: 'manage',
                            rank: value.correct_count,
                            title: "S.C.A.M Management </br> Level 1",
                            desc: "Complete the <br>S.C.A.M Management questions",
                            href: 'quiz.manage'
                        });
                        break;
                }
            });
        });
        //next back class
        achieve.move = {
            next: 'enable',
            back: 'enable'
        };
        //handle next function
        $scope.navigation.next = function(){
            $rootScope.is_thank_you_page = true;
            $rootScope.can_go_back = true;
            achieve.move.next = 'disable';
        };
        //handle back function
        $scope.navigation.back = function(){
            $rootScope.is_thank_you_page = false;
            $rootScope.can_go_back = false;
            achieve.move.next = 'enable';
        };

        achieve.stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $rootScope.is_thank_you_page = false;
                $scope.$on('$destroy', achieve.stateListener);//remove listener after called
            });
}]);