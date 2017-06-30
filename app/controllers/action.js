'use strict';

angular.module('mainApp').controller('ActionController', ['$scope', '$http', '$rootScope', '$timeout',
    'SCAM_CONSTANT', '$location','$stateParams', '$state','trainingService',
    function($scope, $http, $rootScope, $timeout, SCAM_CONSTANT, $location, $stateParams, $state, trainingService) {
        var action = this;
        var slideConfig = SCAM_CONSTANT.ACTION_SLIDE_CONFIG;

        if ($rootScope.is_custom_training == true) {
            slideConfig = SCAM_CONSTANT.CUSTOM_ACTION_SLIDE_CONFIG;
        }

        action.training_pages = [];
        $scope.is_statics = true;
        action.read_page = function(data){
            $rootScope.checkStageInPageComplete(data);
        };

        $scope.navigation.breadcrumb = [
            {
                'name': 'S.C.A.M Training',
                'href': '/home'
            },
            {
                'name': 'Action',
                'href': '/action'
            },
            {
                'name': 'Introduction',
                'href': '/action'
            }
        ];

        action.changeBreadcrumb = function(action) {
            var item_breadcrumb = {
                name:'',
                href:''
            };
            switch(action) {
                case '':
                    item_breadcrumb.name = 'Introduction';
                    item_breadcrumb.href = '/action';
                    break;
                case 'look_under_link':
                    item_breadcrumb.name = 'Action Item #1';
                    item_breadcrumb.href = 'action/look_under_link';
                    break;
                case 'ip_address_unused':
                    item_breadcrumb.name = 'Action Item #2';
                    item_breadcrumb.href = 'action/ip_address_unused';
                    break;
                case 'attachments':
                    item_breadcrumb.name = 'Action Item #3';
                    item_breadcrumb.href = 'action/attachments';
                    break;
                case 'forms':
                    item_breadcrumb.name = 'Action Item #4';
                    item_breadcrumb.href = 'action/forms';
                    break;
            }

            return item_breadcrumb;
        };

        //Check is_static
        action.checkIsStatics = function(current_state) {
            if(current_state == true) {
                return true;
            }else {
                return false;
            }
        };

        action.init = function(){
            var is_landing_page = $stateParams.landing_slide;
            var current_state = $location.path().slice(8);
            var url_list = [];
            angular.forEach(SCAM_CONSTANT.ACTION_SLIDE_CONFIG, function(value, key) {
                angular.forEach(value, function(val, k) {
                    if (val.is_static_slide == true) {
                        url_list.push($rootScope.config_env.base_url + '/assets/scam_training/slides/' + val.data)
                    }
                });
            });

            $scope.loadStaticImage(url_list);

            if(current_state == '' || current_state == 'introduction' || (is_landing_page != undefined && is_landing_page == 'true') ) {
                //check if is landing slide
                if(is_landing_page != undefined && is_landing_page == 'true'){
                    $scope.show_action_landing_page = true;
                }
                //dont show animate slides if current page != introduction
                if(current_state !== '' && current_state != 'introduction'){
                    $scope.action_item_page = current_state;
                    $scope.index_array = 0;
                    $scope.navigation.breadcrumb[2] = action.changeBreadcrumb($scope.action_item_page);
                }else{
                    $scope.action_item_page = 'introduction';
                    $scope.index_array = -1;
                    $scope.is_statics = true;
                    $scope.action_animate_slide = true;
                }
            }else {
                $scope.index_array = 0;
                $scope.action_item_page = current_state;

                if ($rootScope.is_back_from_quiz) {
                    $rootScope.is_back_from_quiz = false;
                    $scope.index_array = slideConfig[current_state].length - 1 ; // last slide
                    $rootScope.slide_index = $scope.index_array;
                }

                $scope.param = slideConfig[$scope.action_item_page][$scope.index_array];
                $scope.is_statics = action.checkIsStatics($scope.param.is_static_slide);
                $scope.navigation.breadcrumb[2] = action.changeBreadcrumb($scope.action_item_page);
            }

            if ($scope.show_action_landing_page == true) {
                $scope.navigation.breadcrumb = [
                    {
                        'name': 'Landing page',
                        'href': '#'
                    }
                ];
            }
        };

        //Start training
        $scope.navigation.startTraining = function() {
            $scope.show_action_landing_page = false;
            $scope.navigation.breadcrumb = [
                {
                    'name': 'S.C.A.M Training',
                    'href': '/home'
                },
                {
                    'name': 'Action',
                    'href': '/action'
                },
                {
                    'name': 'Introduction',
                    'href': '/action'
                }
            ];

            if($scope.action_item_page == 'introduction'){
                $scope.action_animate_slide = true;
            }else {
                $scope.param = slideConfig[$scope.action_item_page][$scope.index_array];
                $scope.is_statics = action.checkIsStatics($scope.param.is_static_slide);
                $scope.navigation.breadcrumb[2] = action.changeBreadcrumb($state.current.url.split('/')[1]);
            }
        };

        //init page
        action.init();

        action.updateStateChange = function(toState) {
            var new_state = toState.url.slice(1);
            if(new_state == '' || new_state == 'action?landing_slide' || new_state == 'introduction' ) {
                $scope.action_item_page = 'introduction';
                $scope.param = slideConfig[$scope.action_item_page][$scope.index_array];
                $scope.index_array = -1;
                $scope.is_statics = true;
                $scope.action_animate_slide = true;
                $rootScope.can_go_back = false;
                $scope.navigation.breadcrumb[2] = action.changeBreadcrumb('');
            }else {
                $scope.action_item_page = new_state;
                if (toState.name.split('.')[0] == 'action') {
                    if($scope.navigation.is_menu == true || $scope.index_array > slideConfig[$scope.action_item_page].length - 1){
                        $scope.index_array = 0;
                    }
                    $scope.navigation.breadcrumb[2] = action.changeBreadcrumb($scope.action_item_page);
                    $scope.param = slideConfig[$scope.action_item_page][$scope.index_array];
                }
                $scope.action_animate_slide = false;
                if($scope.param != undefined) {
                    $scope.is_statics = action.checkIsStatics($scope.param.is_static_slide);
                }
            }
        };

        action.stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                action.updateStateChange(toState);

                var timer = $timeout(function() {
                    if(!angular.element('#menu-modal').hasClass('ng-hide')){
                        angular.element('.menu-toggle').click();
                    }
                    $timeout.cancel(timer); //remove timeout
                });

                $scope.navigation.is_menu = false;
                $rootScope.set_go_back_state(toState,$scope.index_array);
                if($scope.index_array > 0) {
                    $rootScope.can_go_back = true;
                }
                $scope.$on('$destroy', action.stateListener);//remove listener after called
            });

        $scope.navigation.next = function() {
            $scope.action_animate_slide = false;
            $scope.index_array++;
            $rootScope.drawPercentageChart($state.current.name,$scope.index_array);
            $rootScope.can_go_back = true;
            if($scope.action_item_page != 'introduction' && slideConfig[$scope.action_item_page].length > $scope.index_array){
                $scope.navigation.breadcrumb[2] = action.changeBreadcrumb($scope.action_item_page);
                $scope.param = slideConfig[$scope.action_item_page][$scope.index_array];
                $scope.is_statics = action.checkIsStatics($scope.param.is_static_slide);
            }else {
                if ($scope.action_item_page == 'introduction') {
                    $scope.action_item_page = '';
                }
                var next_stage = action.actionStageUrlChange('next', $scope.action_item_page);
                $scope.index_array = 0;
                if (next_stage != 'quiz.action') {
                    $scope.param = slideConfig[next_stage.split('.')[1]][$scope.index_array];
                }
                $scope.is_statics = action.checkIsStatics($scope.param.is_static_slide);

                action.read_page($state.current.name);
                $state.go(next_stage);
            }
        };

        $scope.navigation.back = function() {
            if($scope.index_array > 0){
                $rootScope.drawPercentageChart($state.current.name,$scope.index_array);
                $scope.index_array--;
                $scope.param = slideConfig[$scope.action_item_page][$scope.index_array];
                $scope.is_statics = action.checkIsStatics($scope.param.is_static_slide);
                $scope.navigation.breadcrumb[2] = action.changeBreadcrumb($scope.action_item_page);
            }
            else {
                var back_stage = action.actionStageUrlChange('back', $scope.action_item_page);
                if(back_stage == 'action'){
                    back_stage = 'action';
                    $scope.index_array = -1;
                    $scope.is_statics = true;
                    $scope.action_animate_slide = true;
                    $scope.navigation.breadcrumb[2] = action.changeBreadcrumb('');
                    $rootScope.can_go_back = false;
                }else {
                    if(back_stage == 'action.undefined') {
                        $rootScope.can_go_back = false;
                        $scope.index_array = 0;
                        return;
                    }
                    else {
                        $scope.index_array = SCAM_CONSTANT.ACTION_SLIDE_CONFIG[back_stage.split('.')[1]].length - 1;
                        $scope.param = slideConfig[back_stage.split('.')[1]][$scope.index_array];
                    }
                }
                $scope.is_statics = action.checkIsStatics($scope.param.is_static_slide);
                $state.go(back_stage);
            }
        };

        action.actionStageUrlChange = function(event, current_page) {
            var action_link = '';
            if(event == 'next'){
                action_link =  action.getStateUrlChange(current_page, 1);
            }else {
                $scope.index_array = slideConfig[current_page].length - 1;
                action_link = action.getStateUrlChange(current_page, -1);
            }
            return action_link;
        };

        action.getStateUrlChange = function(current_page, offset) {
            if (action.training_pages.length == 0) {
                action.training_pages = $rootScope.scam_training_pages.action;
            }
            if (current_page == '') {
                current_page = 'introduction'
            }
            var index_current_page = action.training_pages.indexOf(current_page);

            if (index_current_page == action.training_pages.length - 1 && offset > 0) {
                return 'quiz.action';
            } else {
                var next_state = action.training_pages[index_current_page + offset];
                if (next_state == 'introduction') {
                    return 'action.introduction';
                } else if (next_state == 'action') {
                    return 'action';
                }
                return 'action.' + next_state;
            }
        }

    }
]);