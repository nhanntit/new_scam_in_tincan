'use strict';


angular.module('mainApp').controller('MenuController', ['$scope','$rootScope', '$http','achievementService',
    'menuService', 'SCAM_CONSTANT', '$uibModal','$timeout','trainingService', '$state',
    function($scope, $rootScope, $http, achievementService,menuService, SCAM_CONSTANT, $uibModal, $timeout, trainingService, $state) {
        var menuContent = this;
        menuContent.show_hint = false;
        menuContent.activeAchievement = $scope.activeAchieve;

        $rootScope.cup_icon_class = "new-score";

        $rootScope.handleClickOutSideMenu = function($event){
            var is_check_out_side = angular.element('#training_menu').find($event.target).length > 0 ? false : true;
            if(!is_check_out_side && $event.target.tagName != 'A') return;
            var timer = $timeout(function() {
                if(!angular.element('#menu-modal').hasClass('ng-hide')){
                    $rootScope.isShow = false;
                    angular.element('.menu-toggle').addClass('inactive');

                    //return first slide when clicking the link on menu
                    if($event.target.href){
                        $state.reload();
                    }
                }
                $timeout.cancel(timer); //remove timeout
            });
        };
        $rootScope.handleClickOutSideHint = function($event) {
            var is_check_out_side_hint = angular.element('#hint-message').find($event.target).length > 0 ? false : true;
            if (!is_check_out_side_hint) return;

            var timer = $timeout(function () {
                angular.element('.close').click();
                $timeout.cancel(timer);
            });
        };

        $rootScope.toggleMenu = function(){
            $rootScope.isShow = !$rootScope.isShow;

            if(!$rootScope.isShow){
                angular.element('.menu-toggle').addClass('inactive');
            }else{
                menuContent.getAchievement();
                angular.element('.menu-toggle').removeClass('inactive');
                if(!angular.element('#hint-message').hasClass('ng-hide')){
                    menuContent.show_hint = false;
                }
            }
        };
        $rootScope.drawPieChart = function(percent){
            var canvas = document.getElementById("progress");
            var ctx = canvas.getContext("2d");
            var PI = Math.PI;
            var lastend = 0 - PI/2; //start drawing from 12h
            var data = percent || [0, 100]; // Data completed / remain
            var total = 0; // Total data
            var myColor = [SCAM_CONSTANT.COLOR_BACKGROUND_PERCENTAGE, SCAM_CONSTANT.COLOR_BACKGROUND_UNFILL_PERCENTAGE]; // Colors of each slice

            for (var e = 0; e < data.length; e++) {
                total += data[e];
            }

            for (var i = 0; i < data.length; i++) {
                ctx.fillStyle = myColor[i];
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, canvas.height / 2);
                // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
                ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, lastend, lastend + (Math.PI * 2 * (data[i] / total)), false);
                ctx.lineTo(canvas.width / 2, canvas.height / 2);
                ctx.fill();
                lastend += Math.PI * 2 * (data[i] / total);

            }
            ctx.fillStyle = SCAM_CONSTANT.COLOR_TEXT_PERCENTAGE;
            ctx.textAlign = 'center';
            ctx.font = '16px Arial';
            ctx.fillText(Math.round((data[0]/total)*100) + '%', canvas.width / 2, (canvas.height / 2) + 5);//adjust to fit with the design
        };

        //*************************************************************************************
        //Check Stage exits ? in array pages_completed to update Percentage Pie
        $rootScope.checkStageInPageComplete = function(data) {
            if(data.indexOf('.') == -1) {
                if(data == 'definitions') {
                    data = data + '.definitions'
                } else {
                    data = data + '.introduction'
                }
            }
            if ($rootScope.pages_completed.indexOf(data) == -1) {
                $rootScope.pages_completed.push(data);
            }
            trainingService.postPageRead(data);
        };

        //*************************************************************************************
        //Get content achievement
        menuContent.getAchievement = function() {
            if(!$rootScope.achievement_data){
                achievementService.student_achieve().success(function(response){
                    $rootScope.achievement_data = response;
                    menuContent.showAchievementsTable($rootScope.achievement_data);
                });
            }else{
                menuContent.showAchievementsTable($rootScope.achievement_data);
            }
        };
        //Filling data for achievements
        menuContent.showAchievementsTable = function(data){
            menuContent.student_achieve = [];
            menuContent.current_score = 0;
            menuContent.pass_score = data.pass_score;
            angular.forEach(data.student_score, function(value, key) {
                menuContent.current_score += value.correct_count;
                switch(value.section){
                    case 'home':
                        menuContent.student_achieve.push({
                            type: 'home',
                            rank: value.correct_count,
                            title: "Lisa's Leader </br> Award",
                            desc: "Complete the <br>Lisa's Leader questions",
                            href: 'quiz.home'
                        });
                        break;
                    case 'definitions':
                        menuContent.student_achieve.push({
                            type: 'definitions',
                            rank: value.correct_count,
                            title: "Tech Talk </br> Award",
                            desc: "Complete the <br> Tech Talk questions",
                            href: 'quiz.definitions'
                        });
                        break;
                    case 'sender':
                        menuContent.student_achieve.push({
                            type: 'sender',
                            rank: value.correct_count,
                            title: "Swindling Sender </br> Level 1",
                            desc: "Complete the<br> Swindling Sender questions",
                            href: 'quiz.sender'
                        });
                        break;
                    case 'content':
                        menuContent.student_achieve.push({
                            type: 'content',
                            rank: value.correct_count,
                            title: "Curious Content </br> Level 1",
                            desc: "Complete the <br>Curious Content questions",
                            href: 'quiz.content'
                        });
                        break;
                    case 'action':
                        menuContent.student_achieve.push({
                            type: 'action',
                            rank: value.correct_count,
                            title: "Actionable Emails </br> Level 1",
                            desc: "Complete the <br>Actionable Emails questions",
                            href: 'quiz.action'
                        });
                        break;
                    case 'manage':
                        menuContent.student_achieve.push({
                            type: 'manage',
                            rank: value.correct_count,
                            title: "S.C.A.M Management </br> Level 1",
                            desc: "Complete the <br>S.C.A.M Management questions",
                            href: 'quiz.manage'
                        });
                        break;
                }
            });
        };

        //*************************************************************************************
        // calculate slide learned
        var getSlideToLearn = function() {
            var static_slide_num = SCAM_CONSTANT.STATIC_SLIDE_INDEX;
            var total_completed_slide = $rootScope.json_data['completed_page'];
            var slide_has_learn = 0;

            angular.forEach(total_completed_slide, function(value){
                var section_pages = value.split('.');
                var section_name = section_pages[0];
                var page_name = section_pages[1];
                var slide_num = static_slide_num[section_name][page_name];

                if(slide_num != null){
                    slide_has_learn += slide_num;
                }

            });
            slide_has_learn += checkQuizIsComplete();

            return slide_has_learn;
        };

        var drawStudentHasToLearnChart =  function() {
            var total_slide = SCAM_CONSTANT.TOTAL_STATIC_SLIDE;
            if($rootScope.slide_has_learn == 0) {
                $rootScope.slide_has_learn = getSlideToLearn();
            }
            var total_need_to_learn = total_slide - $rootScope.slide_has_learn;
            $rootScope.drawPieChart([$rootScope.slide_has_learn, total_need_to_learn]);
        };

        //Check quiz of this section is complete
        var checkQuizIsComplete = function() {
            var all_training = $rootScope.json_data['all_training'];
            var total_quiz = 0;
            angular.forEach(all_training, function(value, key) {
                var questions_done = value[value.length - 1]['quiz']['last_complete_question'];
                if(value[value.length - 1]['quiz']['completed']){
                    total_quiz += 3;
                    $scope.completedQuizzes[key] = 3;
                }
                else {
                    total_quiz += questions_done;
                    $scope.completedQuizzes[key] = questions_done;
                }
            });
            return total_quiz;
        };

        menuContent.get_menu = function(){
            if($rootScope.json_data == null) {
                menuService.getData()
                    .then(function (result) {
                        if (typeof($rootScope.pages_completed) == 'undefined') {
                            $rootScope.pages_completed = result.completed_page
                        }
                        $rootScope.json_data = result;
                        $scope.json_data = $rootScope.json_data;
                        $rootScope.scam_training_pages = menuContent.set_training_pages(result.all_training);
                        $rootScope.set_go_back_state($state.current);

                        $rootScope.menu_current_score = $scope.json_data['current_score'] == -1 ? '0' : Math.round($scope.json_data['current_score']);
                        drawStudentHasToLearnChart();
                        $rootScope.best_score = $scope.json_data['best_score']['score'] == -1 ? -1 : Math.round($scope.json_data['best_score']['score']) ;
                        if (result.last_visit_page.length > 0 && $state.current.url.split('/')[1] == "home?landing_slide" && !$state.params.landing_slide == true) {
                            menuContent.showHint(result.last_visit_page[0]);
                        }
                        $rootScope.checkAccessibleState(false);

                    },
                    function (result) {
                        window.location.href = "/public/404.html";
                    });
            }
            else{
                $scope.json_data = $rootScope.json_data;
                if (typeof($rootScope.pages_completed) == 'undefined') {
                    $rootScope.pages_completed = $scope.json_data.completed_page
                }
                drawStudentHasToLearnChart();
                $rootScope.menu_current_score = $scope.json_data['current_score'] == -1 ? '0' : Math.round($scope.json_data['current_score']);
                $rootScope.best_score = $scope.json_data['best_score']['score'] == -1 ? -1 : Math.round($scope.json_data['best_score']['score']);
                $rootScope.set_go_back_state($state.current, $rootScope.slide_index);
                $rootScope.checkAccessibleState();
            }
        };
        $scope.name = [];
        $scope.name['home'] = SCAM_CONSTANT.MENU_HOME_NAME_ARRAY;
        $scope.name['definitions'] = SCAM_CONSTANT.MENU_DEFINITION_NAME_ARRAY;
        $scope.name['sender']=SCAM_CONSTANT.MENU_SENDER_NAME_ARRAY;
        $scope.name['content']=SCAM_CONSTANT.MENU_CONTENT_NAME_ARRAY;
        $scope.name['action']=SCAM_CONSTANT.MENU_ACTION_NAME_ARRAY;
        $scope.name['manage']=SCAM_CONSTANT.MENU_MANAGE_NAME_ARRAY;

        //Popup achievement
        menuContent.showAchieve = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'scam_training/templates/layout/achieve.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.student_achieve = menuContent.student_achieve;
                    $scope.current_score = menuContent.current_score;
                    $scope.achieve_best_score = $rootScope.best_score;
                    $scope.pass_score = menuContent.pass_score;
                    $scope.activeAchievement = menuContent.activeAchievement;

                    $scope.ok = function() {
                        $uibModalInstance.dismiss();
                    };
                }],

                backdrop: 'static',
                show: true,
                windowClass: 'app-modal-achieve'
            });
        };
        //*************************************************************************************
        $scope.json_data = [];
        menuContent.get_menu();
        menuContent.getAchievement();
        //*************************************************************************************
        menuContent.getNameOfPage = function(page, section) {
            SCAM_CONSTANT.NAME_OF_PAGE[page];
            if (page == 'ip_addresses' && section == 'sender') {
                return 'Slimey Trick #1';
            }else {
                if (page == 'introduction') {
                    return section.charAt(0).toUpperCase() + section.slice(1) + ' - ' + SCAM_CONSTANT.NAME_OF_PAGE[page];
                }else {
                    return SCAM_CONSTANT.NAME_OF_PAGE[page];
                }
            }
        };
        //Last visit page function
        menuContent.showHint = function(result) {
            menuContent.show_hint = true;
            menuContent.last_page = menuContent.getNameOfPage(result.last_page.toLowerCase(), result.link.split('/')[0]);
            menuContent.last_time_access = result.last_time_access;
            menuContent.link = result.link;
        };
        menuContent.closeMessage = function() {
            menuContent.show_hint = false;
        };

        

        //*************************************************************************************
        //Setup training pages
        menuContent.set_training_pages = function(data_array) {
            return {
                home: menuContent.generate_array(data_array, 'home'),
                definitions: menuContent.generate_array(data_array, 'definitions'),
                sender: menuContent.generate_array(data_array, 'sender'),
                content: menuContent.generate_array(data_array, 'content'),
                action: menuContent.generate_array(data_array, 'action'),
                manage: menuContent.generate_array(data_array, 'manage')
            }
        };

        menuContent.generate_array = function (data_array, section_name) {
            var arrs = [];
            angular.forEach(data_array[section_name], function(value){

                if(value.active == true){
                    if(value.action == 'introduction' || value.action == 'home' )
                    {
                        arrs.push(section_name);
                    }
                    else if(value.action == 'definitions'){
                        arrs.push('');
                    }
                    arrs.push(value.action);
                }
            });

            if(arrs.length == 0) {
                $scope.activeAchieve[section_name] = false;
            }
            return arrs;
        };



    }
]).filter('getFirstLetter', function(){
    return function(input){
        return input.charAt(0).toUpperCase();
    }
});
