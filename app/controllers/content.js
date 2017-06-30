'use strict';

angular.module('mainApp').controller('ContentController', ['$scope', '$http', '$rootScope', '$timeout',
    'SCAM_CONSTANT', '$location', '$stateParams', '$state', 'trainingService',
    function($scope, $http, $rootScope,  $timeout, SCAM_CONSTANT, $location, $stateParams, $state, trainingService) {
        var content = this;
        var slideConfig = SCAM_CONSTANT.CONTENT_SLIDE_CONFIG;

        if ($rootScope.is_custom_training == true) {
            slideConfig = SCAM_CONSTANT.CUSTOM_CONTENT_SLIDE_CONFIG;
        }

        content.training_pages = [];
        content.pre_url = $rootScope.config_env.static_url;
        content.read_page = function(data){
            $rootScope.checkStageInPageComplete(data);
        };

        $scope.navigation.breadcrumb = [
            {
                'name': 'S.C.A.M Training',
                'href': '/home'
            },
            {
                'name': 'Content',
                'href': '/content'
            },
            {
                'name': 'Introduction #1',
                'href': '/content'
            }
        ];

        content.init = function(){
            var is_landing_page = $stateParams.landing_slide;
            var current_state = $location.path().slice(9);
            var url_list = [];

            angular.forEach(slideConfig, function(value, key) {
                angular.forEach(value, function(val, k) {
                    url_list.push(content.pre_url + val)
                });
            });
            $scope.loadStaticImage(url_list);
            if(current_state == '' || current_state == 'introduction' || (is_landing_page != undefined && is_landing_page == 'true') ) {
                //check if is landing slide
                if(is_landing_page != undefined && is_landing_page == 'true'){
                    content.show_content_landing_page = true;
                }
                //dont show animate slides if current page != introduction
                if(current_state !== '' && current_state != 'introduction'){
                    content.content_item_page = current_state;
                    content.index_array = 0;
                    $scope.navigation.breadcrumb[2] = content.changeBreadcrumb(content.content_item_page);
                }else {
                    content.content_item_page = 'introduction';
                    content.index_array = -1;
                    content.content_animate_slide = true;
                    $rootScope.can_go_back = false;
                }

            }else {
                content.index_array = 0;
                content.content_item_page = current_state;
                content.show_content_landing_page = false;
                content.content_static_url = content.pre_url + slideConfig[content.content_item_page][content.index_array];
                $scope.navigation.breadcrumb[2] = content.changeBreadcrumb(content.content_item_page);
            }
            if (content.show_content_landing_page == true) {
                $scope.navigation.breadcrumb = [
                    {
                        'name': 'Landing page',
                        'href': '#'
                    }
                ];
            }
        };

        $scope.navigation.startTraining = function() {
            content.show_content_landing_page = false;
            $scope.navigation.breadcrumb = [
                {
                    'name': 'S.C.A.M Training',
                    'href': '/home'
                },
                {
                    'name': 'Content',
                    'href': '/content'
                },
                {
                    'name': 'Introduction #1',
                    'href': '/content'
                }
            ];

            if(content.item_page == 'introduction'){
                content.content_animate_slide = true;
            }else {
                content.static_url = content.pre_url + slideConfig[content.content_item_page][content.index_array];
            }
            $scope.navigation.breadcrumb[2] = content.changeBreadcrumb($state.current.url.split('/')[1]);
        };
        
        content.changeBreadcrumb = function(action) {
            var item_breadcrumb = {
                name:'',
                href:''
            };
            switch(action) {
                case 'introduction':
                    if(content.index_array == -1 ) {
                        item_breadcrumb.name = 'Introduction #1';
                    }else {
                        item_breadcrumb.name = 'Introduction #'+(content.index_array + 2);
                    }
                    item_breadcrumb.href = 'content/introduction' ;
                    break;
                case 'grammatical_errors':
                    item_breadcrumb.name = 'Lesson #1';
                    item_breadcrumb.href = 'content/grammatical_errors';
                    break;
                case 'urgency':
                    item_breadcrumb.name = 'Lesson #2';
                    item_breadcrumb.href = 'content/urgency';
                    break;
                case 'expected':
                    item_breadcrumb.name = 'Lesson #3';
                    item_breadcrumb.href = 'content/expected';
                    break;
                case 'confusion':
                    item_breadcrumb.name = 'Lesson #4';
                    item_breadcrumb.href = 'content/confusion';
                    break;
                default :
                    item_breadcrumb.name = 'Introduction #1';
                    item_breadcrumb.href = 'content/introduction';
            }

            return item_breadcrumb;
        };

        //Init page
        content.init();

        //pla
        content.updateStateChange = function(toState) {
            var new_state = toState.url.slice(1);
            if(new_state == '' || new_state == 'content?landing_slide' || new_state == 'introduction' ) {
                content.content_item_page = 'introduction';
                if (content.index_array >= 0 && $scope.navigation.is_menu == false && content.index_array <= slideConfig[content.content_item_page].length - 1) {
                    content.content_animate_slide = false;
                    content.content_static_url = content.pre_url + slideConfig[content.content_item_page][content.index_array];
                }else {
                    content.content_animate_slide = true;
                    content.index_array = -1;
                    $rootScope.can_go_back = false;
                }

                if (new_state != 'introduction' || ($scope.navigation.is_menu == true && new_state == 'introduction')) {
                    content.content_animate_slide = true;
                    content.index_array = -1;
                    $rootScope.can_go_back = false;
                    $scope.navigation.breadcrumb[2] = content.changeBreadcrumb('');
                }else {
                    $scope.navigation.breadcrumb[2] = content.changeBreadcrumb(content.content_item_page);
                }
            }else {
                content.content_item_page = new_state;
                if (toState.name.split('.')[0] == 'content') {
                    if($scope.navigation.is_menu == true || content.index_array > slideConfig[content.content_item_page].length - 1){
                        content.index_array = 0;
                    }
                    $scope.navigation.breadcrumb[2] = content.changeBreadcrumb(content.content_item_page);
                    content.content_static_url = content.pre_url + slideConfig[content.content_item_page][content.index_array];
                }
                content.content_animate_slide = false;
            }
        };

        content.stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                content.updateStateChange(toState);
                var timer = $timeout(function() {
                    if(!angular.element('#menu-modal').hasClass('ng-hide')){
                        angular.element('.menu-toggle').click();
                    }
                    $timeout.cancel(timer); //remove timeout
                });

                $rootScope.set_go_back_state(toState);
                if(content.index_array > 0) {
                    $rootScope.can_go_back = true;
                }
                $scope.navigation.is_menu = false;
                $scope.$on('$destroy', content.stateListener);//remove listener after called
            });

        content.content_static_url = content.pre_url + slideConfig[content.content_item_page][0];
        if (content.show_content_landing_page == false) {
            $scope.navigation.breadcrumb[2] = content.changeBreadcrumb(content.content_item_page);
        }

        $scope.navigation.next = function() {
            content.content_animate_slide = false;
            content.index_array++;
            $rootScope.drawPercentageChart($state.current.name, content.index_array);
            $rootScope.can_go_back = true;

            if(slideConfig[content.content_item_page].length > content.index_array ){
                content.content_static_url = content.pre_url + slideConfig[content.content_item_page][content.index_array];
                $scope.navigation.breadcrumb[2] = content.changeBreadcrumb(content.content_item_page);
            }else {
                content.index_array = 0;
                var next_stage = content.contentStageUrlChange('next', content.content_item_page);
                content.read_page($state.current.name);
                $state.go(next_stage);
            }
        };

        $scope.navigation.back = function() {
            if(content.index_array > 0){
                $rootScope.drawPercentageChart($state.current.name, content.index_array);
                content.index_array--;
                content.content_static_url = content.pre_url + slideConfig[content.content_item_page][content.index_array];
                $scope.navigation.breadcrumb[2] = content.changeBreadcrumb(content.content_item_page);
            }else {
                var back_stage = content.contentStageUrlChange('back', content.content_item_page);
                if(back_stage == 'content'){
                    back_stage = 'content';
                    content.content_animate_slide = true;
                    content.content_item_page = 'introduction';
                    content.index_array = -1;
                    $scope.navigation.breadcrumb[2] = content.changeBreadcrumb('');
                    $rootScope.can_go_back = false;
                }else {
                    if(back_stage == 'content.undefined') {
                        $rootScope.can_go_back = false;
                        content.index_array = 0;
                        return;
                    }else {
                        content.index_array = slideConfig[back_stage.split('.')[1]].length - 1;
                    }
                }
                $state.go(back_stage);
            }
        };

        content.contentStageUrlChange = function(event, current_page) {
            if(current_page == '' || current_page == 'introduction') {
                current_page = 'introduction';
            }
            var action_link = '';
            if(event == 'next'){
                action_link = content.getStateUrlChange(current_page, 1);
            }else {
                content.index_array = slideConfig[current_page].length - 1;
                action_link = content.getStateUrlChange(current_page, -1);
            }
            return action_link;
        }

        content.getStateUrlChange = function(current_page, offset){
            if(content.training_pages.length == 0) {
                content.training_pages = $rootScope.scam_training_pages.content;
            }
            if(current_page == '') { current_page = 'introduction' }
            var index_current_page = content.training_pages.indexOf(current_page);

            if(index_current_page == content.training_pages.length - 1 && offset > 0) {
                return 'quiz.content';
            }
            else {
                var next_state = content.training_pages[index_current_page + offset];
                if( next_state == 'introduction') {
                    return 'content.introduction';
                }
                else if(next_state == 'content')
                {
                    return 'content';
                }
                return 'content.' + next_state;
            }
        }
    }
]);


