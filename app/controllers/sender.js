'use strict';

angular.module('mainApp').controller('SenderController', ['$scope', '$http', '$timeout',
    'SCAM_CONSTANT', '$rootScope', '$location', '$stateParams', '$state', 'trainingService',
    function($scope, $http, $timeout, SCAM_CONSTANT, $rootScope, $location, $stateParams, $state, trainingService) {
        var sender = this;
        var slideConfig = SCAM_CONSTANT.SENDER_SLIDE_CONFIG;

        if ($rootScope.is_custom_training == true) {
            slideConfig = SCAM_CONSTANT.CUSTOM_SENDER_SLIDE_CONFIG;
        }

        sender.training_pages = [];
        sender.pre_url = $rootScope.config_env.static_url;
        sender.read_page = function(data) {
            $rootScope.checkStageInPageComplete(data);
        };

        $scope.navigation.breadcrumb = [{
            'name': 'S.C.A.M Training',
            'href': '/home'
        }, {
            'name': 'Sender',
            'href': '/sender'
        }, {
            'name': 'Introduction',
            'href': '/sender'
        }];

        sender.init = function() {
            var is_landing_page = $stateParams.landing_slide;
            var current_state = $location.path().slice(8);
            var url_list = [];
            angular.forEach(slideConfig, function(value, key) {
                angular.forEach(value, function(val, k) {
                    url_list.push(sender.pre_url + val);
                });
            });
            $scope.loadStaticImage(url_list);

            if (current_state == '' || current_state == 'introduction' || (is_landing_page != undefined && is_landing_page == 'true')) {
                //check if is landing slide
                if(is_landing_page != undefined && is_landing_page == 'true'){
                    sender.show_landing_page = true;
                }
                //not show animation if current state != introduction
                if(current_state !== '' && current_state != 'introduction'){
                    sender.item_page = current_state;
                    sender.index_array = 0;
                    $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
                }else{
                    sender.item_page = 'introduction';
                    sender.index_array = -1;
                    sender.animate_slide = true;
                }
            } else {
                sender.index_array = 0;
                if ($rootScope.is_back_from_quiz) {
                    $rootScope.is_back_from_quiz = false;
                    sender.index_array = slideConfig[current_state].length - 1; // last slide
                    $rootScope.slide_index = sender.index_array;
                }
                sender.item_page = current_state;
                sender.show_landing_page = false;
                sender.static_url = sender.pre_url + slideConfig[sender.item_page][sender.index_array];
                $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
            }
            $rootScope.can_go_back = false;
            if (sender.show_landing_page == true) {
                $scope.navigation.breadcrumb = [
                    {
                        'name': 'Landing page',
                        'href': '#'
                    }
                ];
            }
        };

        $scope.navigation.startTraining = function() {
            sender.show_landing_page = false;
            $scope.navigation.breadcrumb = [{
                'name': 'S.C.A.M Training',
                'href': '/home'
            }, {
                'name': 'Sender',
                'href': '/sender'
            }, {
                'name': 'Introduction',
                'href': '/sender'
            }];

            if(sender.item_page == 'introduction'){
                sender.animate_slide = true;
            }else {
                sender.static_url = sender.pre_url + slideConfig[sender.item_page][sender.index_array];
            }
            $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb($state.current.url.split('/')[1]);
        };

        sender.changeBreadcrumb = function(action) {
            var item_breadcrumb = {
                name: '',
                href: ''
            };

            switch (action) {
                case 'introduction':
                    if (sender.index_array == -1) {
                        item_breadcrumb.name = 'Introduction';
                    } else {
                        item_breadcrumb.name = 'First things first';
                    }
                    item_breadcrumb.href = 'sender/introduction';
                    break;
                case 'ip_addresses':
                    item_breadcrumb.name = 'Slimey Trick #1';
                    item_breadcrumb.href = 'sender/ip_addresses';
                    break;
                case 'free_email_providers':
                    item_breadcrumb.name = 'Slimey Trick #2';
                    item_breadcrumb.href = 'sender/free_email_providers';
                    break;
                case 'unusual_domain_names':
                    item_breadcrumb.name = 'Slimey Trick #3';
                    item_breadcrumb.href = 'sender/unusual_domain_names';
                    break;
                case 'incorrect_addressee':
                    if (sender.index_array == 2) {
                        item_breadcrumb.name = 'Conclusion';
                    } else {
                        item_breadcrumb.name = 'Slimey Trick #4';
                    }
                    item_breadcrumb.href = 'sender/incorrect_addressee';
                    break;
                default:
                    item_breadcrumb.name = 'Introduction';
                    item_breadcrumb.href = 'sender/introduction';
            }

            return item_breadcrumb;
        };
        // Start init current controller
        sender.init();

        sender.updateStateChange = function(toState) {
            var new_state = toState.url.slice(1);

            if (new_state == '' || new_state == 'sender?landing_slide' || new_state == 'introduction') {
                sender.item_page = 'introduction';
                if (sender.index_array >= 0 && $scope.navigation.is_menu == false && sender.index_array <= slideConfig[sender.item_page].length - 1) {
                    sender.animate_slide = false;
                    sender.static_url = sender.pre_url + slideConfig[sender.item_page][sender.index_array];
                } else {
                    sender.animate_slide = true;
                    sender.index_array = -1;
                }
                if (new_state != 'introduction' || ($scope.navigation.is_menu == true && new_state == 'introduction')) {
                    sender.animate_slide = true;
                    sender.index_array = -1;
                    $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb('');
                } else {
                    $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
                }

            } else {
                sender.item_page = new_state;
                if (toState.name.split('.')[0] == 'sender') {
                    if ($scope.navigation.is_menu == true || sender.index_array > slideConfig[sender.item_page].length - 1) {
                        sender.index_array = 0;
                    }
                    $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
                    sender.static_url = sender.pre_url + slideConfig[sender.item_page][sender.index_array];
                }
                sender.animate_slide = false;
            }
        };

        sender.stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                sender.updateStateChange(toState);
                var timer = $timeout(function() {
                    if (!angular.element('#menu-modal').hasClass('ng-hide')) {
                        angular.element('.menu-toggle').click();
                    }
                    $timeout.cancel(timer); //remove timeout
                });
                $rootScope.set_go_back_state(toState, sender.index_array );
                if (sender.index_array >= 0)
                    $rootScope.can_go_back = true;
                $scope.navigation.is_menu = false;
                $scope.$on('$destroy', sender.stateListener); //remove listener after called
            });

        $scope.navigation.next = function() {
            sender.animate_slide = false;
            sender.index_array++;
            $rootScope.drawPercentageChart($state.current.name, sender.index_array);
            $rootScope.can_go_back = true;
            if (slideConfig[sender.item_page].length > sender.index_array) {
                sender.static_url = sender.pre_url + slideConfig[sender.item_page][sender.index_array];
                $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
            } else {
                sender.index_array = 0;
                var next_stage = sender.senderStageUrlChange('next', sender.item_page);
                sender.read_page($state.current.name);
                $state.go(next_stage);
            }
        };

        $scope.navigation.back = function() {
            if (sender.index_array > 0) {
                $rootScope.drawPercentageChart($state.current.name, sender.index_array);
                sender.index_array--;
                sender.static_url = sender.pre_url + slideConfig[sender.item_page][sender.index_array];
                $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
            } else {
                var back_stage = sender.senderStageUrlChange('back', sender.item_page);
                if (back_stage == 'sender') {
                    back_stage = 'sender';
                    sender.animate_slide = true;
                    sender.item_page = 'introduction';
                    sender.index_array = -1;
                    $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
                    $rootScope.can_go_back = false;
                } else {
                    if (back_stage == 'sender.undefined') {
                        $rootScope.can_go_back = false;
                        sender.index_array = -1;
                        $scope.navigation.breadcrumb[2] = sender.changeBreadcrumb(sender.item_page);
                        return;
                    } else {
                        sender.index_array = slideConfig[back_stage.split('.')[1]].length - 1;
                    }
                }
                $state.go(back_stage);
            }

        };

        sender.senderStageUrlChange = function(event, current_page) {
            var action_next;
            if (current_page == '' || current_page == 'introduction') {
                current_page = 'introduction';
            }
            if (event === 'next') {
                action_next =  sender.getStateUrlChange(current_page, 1);
            } else {
                sender.index_array = slideConfig[current_page].length - 1;
                action_next = sender.getStateUrlChange(current_page, -1);
            }
            return action_next;
        };

        sender.getStateUrlChange = function(current_page, offset) {
            if (sender.training_pages.length == 0) {
                sender.training_pages = $rootScope.scam_training_pages.sender;
            }
            if (current_page == '') {
                current_page = 'introduction'
            }
            var index_current_page = sender.training_pages.indexOf(current_page);

            if (index_current_page == sender.training_pages.length - 1 && offset > 0) {
                return 'quiz.sender';
            } else {
                var next_state = sender.training_pages[index_current_page + offset];
                if (next_state == 'introduction') {
                    return 'sender.introduction';
                } else if (next_state == 'sender') {
                    return 'sender';
                }
                return 'sender.' + next_state;
            }
        };
    }
]);