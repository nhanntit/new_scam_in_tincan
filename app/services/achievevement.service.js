angular.module('mainApp')
    .factory("achievementService", ['$http',function AchivementFactory($http) {
        return {
            student_achieve: function () {
                return $http({ cache: false, headers: { 'Cache-Control': 'no-cache' }, method: "GET", url: "/api/v1/scam_training/student_achievement/" });
            }
        };
    }]);