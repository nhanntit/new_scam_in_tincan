'use strict';

angular.module('mainApp').controller('DefinitionController', ['$scope', '$http', '$rootScope', '$timeout',
    'SCAM_CONSTANT', '$location', '$state', 'trainingService',

    function($scope, $http, $rootScope, $timeout, SCAM_CONSTANT, $location, $state, trainingService) {
        var definition = this;
        var slide_definition = SCAM_CONSTANT.DEFINITION_STATIC_SLIDE_ARRAY;

        if ($rootScope.is_custom_training == true) {
            slide_definition = SCAM_CONSTANT.CUSTOM_DEFINITION_STATIC_SLIDE_ARRAY;
        }

        $scope.pre_url = $rootScope.config_env.base_url + '/assets/scam_training/slides/definitions/';
        definition.is_back = false;

        definition.training_pages = [];
        definition.read_page = function(data) {
            $rootScope.checkStageInPageComplete(data);
        };

        $scope.slideConfig = {
            definitions: 0,
            phishing: 1,
            spear_phishing: 4,
            cc_and_bc: 5,
            ip_addresses: 8,
            domain_names: 9,
            url: 11
        };
        $scope.slideNum = {
            definitions: 1,
            phishing: 3,
            spear_phishing: 1,
            cc_and_bc: 3,
            ip_addresses: 1,
            domain_names: 2,
            url: 7
        };
        $scope.navigation.breadcrumb = [{
            'name': 'Definitions',
            'href': '/definitions'
        }, {
            'name': 'Introduction',
            'href': '/definitions'
        }];

        // index is current index of item in manage ($scope.index_array)
        // return item second of breadcrumb
        definition.changeBreadcrumb = function(index_page) {
            var item_breadcrumb = {
                name: '',
                href: ''
            };

            if (index_page >= 11) {
                item_breadcrumb.name = 'URL #' + ($scope.index_array - 10);
                item_breadcrumb.href = 'definitions/url';
            } else if (index_page >= 9 && index_page < 11) {
                item_breadcrumb.name = 'Domain Names #' + ($scope.index_array - 8);
                item_breadcrumb.href = 'definitions/domain_names';
            } else if (index_page == 8) {
                item_breadcrumb.name = 'IP Address';
                item_breadcrumb.href = 'definitions/ip_addresses';
            } else if (index_page >= 5 && index_page < 8) {
                item_breadcrumb.name = 'CC & BCC #' + ($scope.index_array - 4);
                item_breadcrumb.href = 'definitions/cc_and_bc';
            } else if (index_page == 4) {
                item_breadcrumb.name = 'Spear Phishing';
                item_breadcrumb.href = 'definitions/spear_phishing';
            } else if (index_page >= 1 && index_page < 4) {
                item_breadcrumb.name = 'Phishing #' + ($scope.index_array);
                item_breadcrumb.href = 'definitions/phishing';
            } else {
                item_breadcrumb.name = 'Introduction';
                item_breadcrumb.href = '/definitions';
            }
            return item_breadcrumb;
        };

        definition.init = function(){
            var url = $location.path().slice(13); // "/definitions/"
            definition.cur_state = $state.current.name.split('.')[1] || 'definitions';

            definition.pageSlideNum = 0;

            $scope.current_page = $scope.pre_url + slide_definition[0];
            var url_list = [];

            angular.forEach(slide_definition, function (value, key) {
                url_list.push($scope.pre_url + value);
            });
            $scope.loadStaticImage(url_list);

            $scope.index_array = $scope.slideConfig[url] || 0;
            if($rootScope.is_back_from_quiz){
                $scope.index_array += ($scope.slideNum[url] - 1);
                $rootScope.is_back_from_quiz = false;
                definition.pageSlideNum = $scope.slideNum[url] + 1 ;
            }

            $rootScope.slideIndex = {
                read: $rootScope.countReadSlide($state.current.name),
                total:  $scope.slideNum[url]
            };
            $scope.current_page = $scope.pre_url + slide_definition[$scope.index_array];
            $scope.navigation.breadcrumb[1] = definition.changeBreadcrumb($scope.index_array );
        };

        definition.init();

        var stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                var state_url = toState.url.slice(1);
                var slideToGo = $scope.slideConfig[state_url] || 0; //prevent exception

                definition.setPageRead();
                if(definition.is_back){
                    slideToGo += ($scope.slideNum[state_url] - 1);
                    definition.pageSlideNum = $scope.slideNum[state_url] - 1;
                }
                else
                {
                    definition.pageSlideNum = 0;
                }

                $scope.index_array = slideToGo;

                definition.cur_state = toState.name.split('.')[1] || 'definitions';

                $rootScope.set_go_back_state(toState);

                $scope.navigation.breadcrumb[1] = definition.changeBreadcrumb($scope.index_array);
                $scope.current_page = $scope.pre_url + slide_definition[$scope.index_array];
                var timer = $timeout(function() {
                    if (!angular.element('#menu-modal').hasClass('ng-hide')) {
                        angular.element('.menu-toggle').click();
                    }
                    $timeout.cancel(timer); //remove timeout
                });

                $rootScope.slideIndex = {
                    read: $rootScope.countReadSlide(toState.name),
                    total:  $scope.slideNum[state_url]
                };
                $scope.$on('$destroy', stateListener); //remove listener after called
            });

        // Handle button action
        $scope.navigation.next = function() {
            if ($scope.index_array < slide_definition.length - 1) {
                $scope.index_array++;

                $rootScope.drawPercentageChart($state.current.name, definition.pageSlideNum);
                definition.pageSlideNum++;
                $scope.navigation.breadcrumb[1] = definition.changeBreadcrumb($scope.index_array);
                $scope.current_page = $scope.pre_url + slide_definition[$scope.index_array];
                $rootScope.can_go_back = true;

                var next_stage = definition.contentStageUrlChange('next', definition.cur_state);
                var next_stage_start_slide = next_stage.split('.')[1] || 'definitions';
                if ($scope.slideNum[definition.cur_state] == definition.pageSlideNum) {
                    //definition.pageSlideNum = 0;
                    $scope.index_array = $scope.slideConfig[next_stage_start_slide];
                    definition.is_back = false;
                    $state.go(next_stage);
                }
            } else {
                if($scope.index_array == slide_definition.length - 1 ){
                    $rootScope.drawPercentageChart($state.current.name, definition.pageSlideNum);
                    definition.pageSlideNum++;
                }
                definition.is_back = false;
                $state.go('quiz.definitions');
            }
        };

        $scope.navigation.back = function() {
            if ($scope.index_array > 0) {
                $scope.index_array--;
                $rootScope.drawPercentageChart($state.current.name, definition.pageSlideNum);
                definition.pageSlideNum--;

                $scope.navigation.breadcrumb[1] = definition.changeBreadcrumb($scope.index_array);
                $scope.current_page = $scope.pre_url + slide_definition[$scope.index_array];

                // change state when ...
                var back_stage = definition.contentStageUrlChange('back', definition.cur_state);
                if ($scope.index_array == ($scope.slideConfig[definition.cur_state] - 1)) {
                    definition.is_back = true;
                    definition.pageSlideNum++;
                    $state.go(back_stage);
                }
            }
        };

        definition.contentStageUrlChange = function(event, current_page) {
            if (current_page == '' || current_page == 'definitions' || typeof(current_page) == 'undefined') {
                current_page = 'definitions';
            }
            var action_link = '';
            if (event == 'next') {
                action_link = definition.getStateUrlChange(current_page, 1);
            } else {
                definitions.index_array = $scope.slideConfig[current_page];
                action_link = definition.getStateUrlChange(current_page, -1);
            }
            return action_link
        };

        definition.getStateUrlChange = function(current_page, offset) {
            if (definition.training_pages.length == 0) {
                definition.training_pages = $rootScope.scam_training_pages.definitions;
            }

            if (current_page == '') {
                current_page = 'definitions';
                $rootScope.can_go_back = false;
            }

            var index_current_page = definition.training_pages.indexOf(current_page);
            if (index_current_page == definition.training_pages.length - 1 && offset > 0) {
                return 'quiz.definitions';
            } else {
                var next_state = definition.training_pages[index_current_page + offset];
                if (next_state == 'definitions') {
                    return 'definitions.definitions';
                }
                return 'definitions.' + next_state;
            }
        }

        definition.setPageRead = function () {
            if($rootScope.slideIndex.read == $rootScope.slideIndex.total - 1){
                $rootScope.drawPercentageChart($state.current.name, definition.pageSlideNum);
            }
            if($rootScope.slideIndex.read == $rootScope.slideIndex.total || $state.current.name == 'definitions') {
                definition.read_page($state.current.name);
            }
        }

    }
]);
