'use strict';

angular.module('mainApp').controller('MasterLayoutController', [ '$rootScope',
  '$scope', '$http', 'preloaderService', 'SCAM_CONSTANT', '$location', '$state', function($rootScope, $scope, $http, preloaderService, SCAM_CONSTANT, $location, $state) {

        //set base url for load data from server
        $rootScope.config_env = {
            base_url: $scope.configs[0].server_env.host,
            environment: $scope.configs[0].server_env.env,
            static_url: $scope.configs[0].server_env.host  + '/assets/scam_training/slides/'
        };

        $rootScope.training_config = {
            company_id: parseInt($scope.configs[0].current_zone_id),
            company_name: $scope.configs[0].company_name,
            is_custom_training: parseInt($scope.configs[0].is_custom_training)
        };

        $rootScope.is_custom_training = false;

        if ($rootScope.training_config.is_custom_training == 1) {
            $rootScope.is_custom_training = true;
        }

        $scope.activeAchieve = {
            home: true,
            definitions: true,
            sender: true,
            content: true,
            action: true,
            manage: true
        };
        $scope.completedQuizzes = {
            home: 0,
            definitions: 0,
            sender: 0,
            content: 0,
            action: 0,
            manage: 0
        };

        $rootScope.slideIndex = {
            read: 0,
            total: 0
        };

        $scope.total_slide = SCAM_CONSTANT.TOTAL_STATIC_SLIDE;
        $rootScope.can_go_back = false;
        $rootScope.slide_index = 0;
        $rootScope.slide_has_learn = 0;
        $rootScope.slidesRead = [];
        $rootScope.achievement_data = null;
        $rootScope.pages_completed = [];

        $rootScope.drawPercentageChart = function (section_page, slides_index, increase_val) {
            section_page = $scope.setSectionPagesName(section_page);
            if ($rootScope.pages_completed.indexOf(section_page) == -1) {

                if ($rootScope.slidesRead.indexOf(section_page + "." + slides_index) == -1) {
                    $rootScope.slideIndex.read += 1;
                    $rootScope.slidesRead.push(section_page + "." + slides_index);
                    if (increase_val == undefined) {
                        increase_val = 1;
                    }
                    $rootScope.slide_has_learn += increase_val;
                }
            }
            // $rootScope.drawPieChart([$rootScope.slide_has_learn, $scope.total_slide - $rootScope.slide_has_learn]);
        };

        $scope.setSectionPagesName = function (section_page) {
            if (section_page.indexOf('.') == -1) {
                switch (section_page) {
                    case 'home':
                        section_page = 'home.home';
                        break;
                    case 'definitions':
                        section_page = 'definitions.definitions';
                        break;
                    default:
                        section_page = section_page + '.introduction';
                }
            }
            return section_page;
        };

        $rootScope.set_go_back_state = function (state, index_array) {
            var cur_page = state.url.replace('/', '');
            var cur_section = state.name.replace('.' + cur_page, '');
            var current_section_states = $rootScope.scam_training_pages[cur_section];
            if (cur_page == '') {
                $rootScope.can_go_back = false;
            }
            else if (current_section_states != null && current_section_states.length > 0) {
                var cur_state_index = current_section_states.indexOf(cur_page);
                var pre_state = current_section_states[cur_state_index - 1];
                var t = ['home', 'sender', 'content', 'action', 'manage', ''];
                if (cur_state_index >= 1 && t.indexOf(pre_state) == -1) {
                    $rootScope.can_go_back = true;
                }
                else {
                    if (index_array != null && index_array > 0) {
                        $rootScope.can_go_back = true;
                    }
                    else {
                        $rootScope.can_go_back = false;
                    }
                }
            }
        };

        $rootScope.countReadSlide = function (state) {
            var iNum = 0;
            angular.forEach($rootScope.slidesRead, function (value) {
                if (value.indexOf(state) != -1) {
                    iNum++;
                }
            });
            return iNum;
        };

        $scope.navigation = {
            'breadcrumb': [
                {
                    'name': 'S.C.A.M Training',
                    'href': '/home'
                },
                {
                    'name': 'Introduction',
                    'href': '/home'
                },
                {
                    'name': 'Definition',
                    'href': '/definition'
                }
            ],
            is_menu: false,

            'next': function () {
                alert('Not implemented');
            },

            'back': function () {
                alert('Not implemented');
            },
            'startTraining': function () {
                alert('Go To training');
            },
            is_disable_menu: false
        };

        // load static image before show
        $scope.loadStaticImage = function (url) {
            preloaderService.preloadImages(url);
        };
        // check accessible state
        $rootScope.checkAccessibleState = function (toState) {
            if ($rootScope.json_data) {

                var requested_url = $location.path();
                var sign = '/';
                var idex = [0, 1];
                if (toState) {
                    requested_url = toState.name;
                    sign = '.';
                    if (requested_url.split(sign).filter(Boolean)[idex[0]] == 'quiz') {
                        idex = [1, 0];
                    }
                }
                var sections = $rootScope.json_data['all_training'];
                var section_name = requested_url.split(sign).filter(Boolean)[idex[0]];
                var requested_state = requested_url.split(sign).filter(Boolean)[idex[1]] || 'introduction';
                var is_accessible = false;
                //return if requested url in AchievementController
                if (section_name == 'achievement') return;
                //check accessability of current state
                if (requested_state !== 'quiz') {
                    if (section_name == 'definitions' && requested_state == 'introduction') {
                        requested_state = section_name;
                    }
                    angular.forEach(sections[section_name], function (state) {
                        if (state.action == requested_state) {
                            is_accessible = state.active;
                        }
                    });
                } else {
                    angular.forEach($rootScope.scam_training_pages, function (pages, section) {
                        if (section_name == section) {
                            is_accessible = pages.length != 0 ? true : false;
                        }
                    });
                }
                //if not accesable redirect to home
                if (!is_accessible) {
                    $location.path('/home');
                }
            }
        }
        $scope.stateListener = $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {

                if (toState.name != 'introduction' && toState.name != fromState.name) {
                    $rootScope.checkAccessibleState(toState);
                }
                $scope.$on('$destroy', $scope.stateListener);//remove listener after called
            });
    }]);
