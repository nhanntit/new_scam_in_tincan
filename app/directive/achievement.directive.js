'use strict';

var mainApp = angular.module('mainApp');

mainApp.directive("achievement.popup", ['$uibModal', '$timeout', function($uibModal, $timeout) {
    return {
        restrict: 'E',
        link: function($scope, element, attrs) {
            $scope.section = attrs.section;
            var importantPopup = function() {
                $scope.showImportant = $uibModal.open({
                    templateUrl: 'scam_training/templates/layout/alert_popup.html',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.ok = function() {
                            $uibModalInstance.dismiss();
                        };
                    }],

                    backdrop: 'static',
                    show: true,
                    windowClass: 'app-modal-important'
                });
            };

            if ($scope.section != 'important') {
                var modalInstance = $uibModal.open({
                    templateUrl: 'scam_training/templates/achievement/popup.html',
                    controller:  ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.section = attrs.section;
                        var title = '';
                        switch ($scope.section) {
                            case 'introduction':
                                title = "You've earned <b>Lisa's Leader</b> award";
                                break;
                            case 'definitions':
                                title = "You've earned <br>the <b>Tech Talk Level 1</b> award";
                                break;
                            case 'sender':
                                title = "You've earned <br>the <b>Swindling Sender</b> award";
                                break;
                            case 'content':
                                title = "You've earned <br>the <b>Curious Content</b> award";
                                break;
                            case 'action':
                                title = "You've earned <br>the <b>Actionable Email</b> award";
                                break;
                            case 'manage':
                                title = "You've earned <br>the <b>S.C.A.M management</b> award";
                                break;
                            case 'award':
                                title = "You've passed <br>the <b>Phriendly Phishing Level 1</b>";
                                break;
                            default :
                                title = "You've earned <b>Lisa's Leader</b> award";
                                $scope.section = 'introduction';
                                break;
                        }

                        $scope.title = title;

                        $scope.ok = function() {
                            if ($scope.section != 'award') {
                                $uibModalInstance.dismiss();
                            }else {
                                $uibModalInstance.dismiss();
                            }
                        };
                    }],

                    backdrop: 'static',
                    show: true,
                    windowClass: 'app-modal-window'
                });
            }else {
                $timeout(function(){
                    importantPopup();
                }, 3000);
            }
        }
    }
}]);