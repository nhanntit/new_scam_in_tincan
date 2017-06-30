'use strict';

angular.module('mainApp').controller('ManageController', ['$scope', '$http', '$rootScope','$timeout',
    'SCAM_CONSTANT', '$location','$stateParams', '$state', 'trainingService',
    function($scope, $http, $rootScope, $timeout, SCAM_CONSTANT, $location, $stateParams, $state, trainingService) {
        var manage = this;
        var slideConfig = SCAM_CONSTANT.MANAGE_SLIDE_CONFIG;

        if ($rootScope.is_custom_training == true) {
            slideConfig = SCAM_CONSTANT.CUSTOM_MANAGE_SLIDE_CONFIG;
        }

        $scope.pre_url = $rootScope.config_env.static_url;
        $scope.is_statics = true;
        manage.training_pages = [];
        manage.read_page = function(data){
            $rootScope.checkStageInPageComplete(data);
        };

        $scope.navigation.breadcrumb = [
            {
                'name': 'S.C.A.M Training',
                'href': '/home'
            },
            {
                'name': 'Manage',
                'href': '/manage'
            },
            {
                'name': 'Introduction #1',
                'href': '/introduction'
            }
        ];

        //Check is_static
        manage.checkIsStatics = function(current_state) {
            if(current_state == true) {
                return true;
            }else {
                return false;
            }
        };

        manage.init = function(){
            var url_list = [];
            angular.forEach(slideConfig, function(value, key) {
                angular.forEach(value, function(val, k) {
                    if (val.is_static_slide == true) {
                        url_list.push($scope.pre_url + val.data)
                    }
                });
            });
            $scope.loadStaticImage(url_list);
            var is_landing_page = $stateParams.landing_slide;
            var current_state = $location.path().slice(8);
            if (current_state == '' || current_state == 'introduction' || (is_landing_page != undefined && is_landing_page == 'true')) {
                //check if is landing slide
                if(is_landing_page != undefined && is_landing_page == 'true'){
                    $scope.show_manage_landing_page = true;
                }
                //dont show animate slides if current page != introduction
                if(current_state !== '' && current_state != 'introduction'){
                    $scope.manage_item_page = current_state;
                    $scope.index_array = 0;
                    $scope.navigation.breadcrumb[2] =  manage.changeBreadcrumb($scope.manage_item_page);
                }else{
                    $scope.manage_item_page = 'introduction';
                    $scope.index_array = -1;
                    $scope.manage_animate_slide = true;
                    $rootScope.can_go_back = false;
                    $scope.is_statics = true;
                }
            } else {
                $scope.index_array = 0;
                $scope.manage_item_page = current_state;

                if ($rootScope.is_back_from_quiz) {
                    $rootScope.is_back_from_quiz = false;
                    $scope.index_array = slideConfig[current_state].length - 1 ; // last slide
                    $rootScope.slide_index = $scope.index_array;
                }

                $scope.param = slideConfig[$scope.manage_item_page][$scope.index_array];
                $scope.is_statics = manage.checkIsStatics($scope.param.is_static_slide);
                $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb($scope.manage_item_page);
            }
            if ($scope.show_manage_landing_page == true) {
                $scope.navigation.breadcrumb = [
                    {
                        'name': 'Landing page',
                        'href': '#'
                    }
                ];
            }
        };

        $scope.navigation.startTraining = function() {
            $scope.show_manage_landing_page = false;
            $scope.navigation.breadcrumb = [
                {
                    'name': 'S.C.A.M Training',
                    'href': '/home'
                },
                {
                    'name': 'Manage',
                    'href': '/manage'
                },
                {
                    'name': 'Introduction #1',
                    'href': '/introduction'
                }
            ];

            if($scope.action_item_page == 'introduction'){
                $scope.manage_animate_slide = true;
            }else {
                $scope.param = slideConfig[$scope.manage_item_page][$scope.index_array];
                $scope.is_statics = manage.checkIsStatics($scope.param.is_static_slide);
            }
            $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb($state.current.url.split('/')[1]);
        };

        manage.changeBreadcrumb = function(action) {
            var item_breadcrumb = {
                name:'',
                href:''
            };

            switch(action) {
                case 'introduction':
                    item_breadcrumb.name = 'Introduction #2';
                    item_breadcrumb.href = 'manage/introduction';
                    break;
                case 'dont_respond':
                    item_breadcrumb.name = 'Directive #1';
                    item_breadcrumb.href = 'manage/dont_respond';
                    break;
                case 'dont_do_anything':
                    item_breadcrumb.name = 'Directive #2';
                    item_breadcrumb.href = 'manage/dont_do_anything';
                    break;
                case 'contact_help':
                    if($scope.index_array == 0){
                        item_breadcrumb.name = 'Directive #3 Option 1';
                    }else {
                        item_breadcrumb.name = 'Directive #3 Option 2';
                    }
                    item_breadcrumb.href = 'manage/contact_help';
                    break;
                case 'relax':
                    item_breadcrumb.name = 'Directive #4';
                    item_breadcrumb.href = 'manage/relax';
                    break;
                default :
                    item_breadcrumb.name = 'Introduction #1';
                    item_breadcrumb.href = '/manage';
            }

            return item_breadcrumb;

        };

        // Start init current controller
        manage.init();

        manage.updateStateChange = function(toState) {
            var new_state = toState.url.slice(1);
            if(new_state == '' || new_state == 'manage?landing_slide' || new_state == 'introduction' ) {
                $scope.manage_item_page = 'introduction';

                if ($scope.index_array >= 0 && $scope.navigation.is_menu == false && $scope.index_array <= slideConfig[$scope.manage_item_page].length - 1) {
                    $scope.manage_animate_slide = false;
                    $scope.param = slideConfig[$scope.manage_item_page][$scope.index_array];
                    $scope.is_statics = manage.checkIsStatics($scope.param.is_static_slide);
                }else {
                    $scope.manage_animate_slide = true;
                    $rootScope.can_go_back = false;
                }

                if (new_state != 'introduction' || ($scope.navigation.is_menu == true && new_state == 'introduction')) {
                    $scope.manage_animate_slide = true;
                    $rootScope.can_go_back = false;
                    $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb('');
                }else {
                    $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb($scope.manage_item_page);
                }
            }else {
                $scope.manage_item_page = new_state;
                if (toState.name.split('.')[0] == 'manage') {
                    if($scope.navigation.is_menu == true || $scope.index_array > slideConfig[$scope.manage_item_page].length - 1){
                        $scope.index_array = 0;
                    }
                    $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb($scope.manage_item_page);
                    $scope.param = slideConfig[$scope.manage_item_page][$scope.index_array];
                    $scope.is_statics = manage.checkIsStatics($scope.param.is_static_slide);
                }
                $scope.manage_animate_slide = false;
            }
        };

        manage.stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                manage.updateStateChange(toState);
                var timer = $timeout(function() {
                    if(!angular.element('#menu-modal').hasClass('ng-hide')){
                        angular.element('.menu-toggle').click();
                    }
                    $timeout.cancel(timer); //remove timeout
                });

                if($scope.index_array > 0){
                    $rootScope.can_go_back = true;
                }
                $scope.navigation.is_menu = false;
                $scope.$on('$destroy', manage.stateListener);
            });

        $scope.navigation.next = function() {
            $scope.manage_animate_slide = false;
            $scope.index_array++;
            $rootScope.drawPercentageChart($state.current.name, $scope.index_array);
            $rootScope.can_go_back = true;
            if(slideConfig[$scope.manage_item_page].length > $scope.index_array ){
                $scope.param = slideConfig[$scope.manage_item_page][$scope.index_array];
                $scope.is_statics = manage.checkIsStatics($scope.param.is_static_slide);
                $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb($scope.manage_item_page);
            } else {
                $scope.index_array = 0;
                var next_stage = manage.manageStageUrlChange('next', $scope.manage_item_page);
                manage.read_page($state.current.name);
                $state.go(next_stage);
            }
        };

        $scope.navigation.back = function() {
            if($scope.index_array > 0){
                $rootScope.drawPercentageChart($state.current.name, $scope.index_array);
                $scope.index_array--;
                $scope.param = slideConfig[$scope.manage_item_page][$scope.index_array];
                $scope.is_statics = manage.checkIsStatics($scope.param.is_static_slide);
                $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb($scope.manage_item_page);
            } else {
                var back_stage = manage.manageStageUrlChange('back', $scope.manage_item_page);
                if(back_stage == 'manage'){
                    back_stage = 'manage';
                    $scope.manage_animate_slide = true;
                    $scope.manage_item_page = 'introduction';
                    $scope.index_array = -1;
                    $rootScope.can_go_back = false;
                }else {
                    if(back_stage == 'manage.undefined')
                    {
                        $rootScope.can_go_back = false;
                        $scope.index_array = 0;
                        return;
                    }
                    else {
                        $scope.index_array = slideConfig[back_stage.split('.')[1]].length - 1;
                    }
                }
                $scope.navigation.breadcrumb[2] = manage.changeBreadcrumb('');
                $state.go(back_stage);
            }
        };

        manage.manageStageUrlChange = function(event, current_page) {
            var action_next;
            if(current_page == '' || current_page == 'introduction') {
                current_page = 'introduction';
            }
            if(event == 'next'){
                action_next = manage.getStateUrlChange(current_page, 1);
            }else {
                $scope.index_array = slideConfig[current_page].length - 1;
                action_next = manage.getStateUrlChange(current_page, -1);
            }

            return action_next;
        };

        manage.getStateUrlChange = function(current_page, offset){
            if(manage.training_pages.length == 0) {
                manage.training_pages = $rootScope.scam_training_pages.manage;
            }
            if(current_page == '') { current_page = 'introduction' }
            var index_current_page = manage.training_pages.indexOf(current_page);

            if(index_current_page == manage.training_pages.length - 1 && offset > 0) {
                return 'quiz.manage';
            }else {
                var next_state = manage.training_pages[index_current_page + offset];
                if( next_state == 'introduction') {
                    return 'manage.introduction';
                }else if(next_state == 'manage')
                {
                    return 'manage';
                }
                return 'manage.' + next_state;
            }
        };
    }

]);

