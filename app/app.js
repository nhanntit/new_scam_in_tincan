'use strict';

angular.module('mainApp', [
  'ui.router',
  'ui.bootstrap',
  'ngSanitize',
  'ngAnimate',
  'LocalStorageModule',
  'templates'
])
.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ph2');
}]);
