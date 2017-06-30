'use strict';
var mainApp = angular.module('mainApp');
mainApp.directive('imageonload',['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                //alert('image is loaded');
            });
            element.bind('error', function(){
                //alert('image could not be loaded');
            });
        }
    };
}]);