'use strict';

angular.module('mainApp').controller('IntroductionController', ['$scope', '$http', '$timeout',
    'SCAM_CONSTANT', '$stateParams', '$state', 'trainingService', '$rootScope',
    function($scope, $http, $timeout, SCAM_CONSTANT, $stateParams, $state, trainingService, $rootScope) {
        var introduction = this;
        var slideConfig = SCAM_CONSTANT.INTRO_SLIDE_CONFIG;

        if ($rootScope.is_custom_training == true) {
            slideConfig = SCAM_CONSTANT.CUSTOM_INTRO_SLIDE_CONFIG;
        }

        $scope.is_statics = true;
        var myBreadcrumb = angular.element(document.querySelector('.breadcrumb-nav'));

        $scope.animate_number = 0;
        $scope.pre_url = $rootScope.config_env.static_url;
        introduction.read_page = function(data) {
            $rootScope.checkStageInPageComplete(data);
        };

        var url_list = [];
        angular.forEach(slideConfig, function(value, key) {
            angular.forEach(value, function(val, k) {
                if (val.is_static_slide == true) {
                    url_list.push($scope.pre_url + val.data)
                }
            });
        });
        $scope.loadStaticImage(url_list);
        $scope.loadStaticImage([$rootScope.config_env.base_url + '/assets/scam_training/slides/quiz/Quiz-Intro.jpg']);

        var changeBreadcrumb = function(index) {
            var item_breadcrumb = {
                name: '',
                href: ''
            };
            item_breadcrumb.name = 'Introduction #' + (index + 2);
            item_breadcrumb.href = '/home';

            return item_breadcrumb;
        };

        $scope.navigation.breadcrumb = [{
            'name': 'Introduction #1',
            'href': '/home'
        }];

        //Check is_static
        introduction.checkIsStatics = function(current_state) {
            if(current_state == true) {
                return true;
            }else {
                return false;
            }
        };

        $scope.index_array = -4;

        $scope.param = slideConfig['introduction']['0'];
        $scope.is_statics = introduction.checkIsStatics($scope.param.is_static_slide);

        //  Handle show hide landing slide or enable static slide
        if ($stateParams.landing_slide !== undefined && $stateParams.landing_slide == 'true') {
            $scope.show_lading_page = true;
            $scope.navigation.breadcrumb = [
                {
                    'name': 'Landing page',
                    'href': '#'
                }
            ];
        } else {
            $scope.show_lading_page = false;
            $scope.animate_slide = true;
            myBreadcrumb.hide();
        }

        $scope.navigation.startTraining = function() {
            $scope.show_lading_page = false;
            myBreadcrumb.hide();
            $scope.navigation.breadcrumb = [{
                'name': 'Introduction #1',
                'href': '/home'
            }];
            $scope.animate_slide = true;
            introduction.initAnimation.animate_1(true);
        };

        // Handle button action
        $scope.enable_btn_action = false;

        //check if is redirected from quiz
        if ($rootScope.is_back_from_quiz) {
            $rootScope.is_back_from_quiz = false;
            var last_slide = (slideConfig.introduction.length - 1) || 0;
            $scope.param = slideConfig['introduction'][last_slide];
            $scope.is_statics = introduction.checkIsStatics($scope.param.is_static_slide);
            $scope.index_array = last_slide;
            $scope.navigation.breadcrumb[0] = changeBreadcrumb($scope.index_array);
            $scope.animate_slide = false;
            $scope.enable_btn_action = true;
            if ($rootScope.slidesRead.indexOf('home.home.' + (last_slide).toString()) == -1) {
                $rootScope.drawPercentageChart('home.home', last_slide);
            }
            $scope.animate_number = 2;
            myBreadcrumb.show();
        }
        $scope.navigation.next = function() {
            if ($scope.animate_slide == false && $scope.animate_number == 2) {
                if ($scope.index_array < slideConfig.introduction.length - 1) {
                    if ($scope.index_array == -4) {
                        $rootScope.drawPercentageChart('home.home', $scope.index_array, 1);
                    }
                    else {
                        $rootScope.drawPercentageChart('home.home', $scope.index_array, 1);
                    }
                    $scope.index_array++;
                    $scope.param = slideConfig['introduction'][$scope.index_array];
                    $scope.is_statics = introduction.checkIsStatics($scope.param.is_static_slide);

                    $scope.navigation.breadcrumb[0] = changeBreadcrumb($scope.index_array);

                } else {
                    $rootScope.drawPercentageChart('home.home', $scope.index_array);
                    $scope.index_array++;
                    introduction.read_page('home.home');
                    $state.go('quiz.home');
                }
            }else {
                $scope.enable_btn_action = false;
                $scope.animate_number++;
                switch ($scope.animate_number) {
                    case 0:
                        introduction.initAnimation.animate_1(true);
                        break;
                    case 1:
                        introduction.initAnimation.animate_2(true);
                        break;
                    case 2:
                        $scope.animate_slide = false;
                        $scope.enable_btn_action = true;
                        introduction.initAnimation.init();
                }

                $rootScope.drawPercentageChart('home.home', $scope.index_array, 1);
                $scope.index_array++;
                if( $scope.index_array == 0){
                    $scope.navigation.breadcrumb[0] = changeBreadcrumb($scope.index_array);
                    $scope.param = slideConfig['introduction'][$scope.index_array];
                    $scope.is_statics = introduction.checkIsStatics($scope.param.is_static_slide);
                }

            }
        };

        $scope.navigation.back = function() {
            if ($scope.index_array > 0) {
                $scope.index_array--;
                $scope.param = slideConfig['introduction'][$scope.index_array];
                $scope.is_statics = introduction.checkIsStatics($scope.param.is_static_slide);
                $rootScope.drawPercentageChart('home.home',$scope.index_array );
                $scope.navigation.breadcrumb[0] = changeBreadcrumb($scope.index_array);
            } else {
                $scope.enable_btn_action = false;
                $scope.animate_slide = true;

                if($scope.animate_number < 1){
                    $scope.animate_number = 0;
                }else {
                    $scope.animate_number--;
                }
                introduction.initAnimation.init();
                switch ($scope.animate_number) {
                    case 0:
                        $scope.index_array = -4;
                        $rootScope.drawPercentageChart('home.home', -4);
                        introduction.initAnimation.animate_1(true);
                        $scope.enable_btn_action = false;

                        break;
                    case 1:
                        $scope.index_array = -2;
                        $rootScope.drawPercentageChart('home.home', -2);
                        introduction.initAnimation.animate_2(false);
                        break;
                }
                $scope.navigation.breadcrumb[0] = changeBreadcrumb(-1);
            }
        };

        // make animation for all slide
        introduction.initAnimation = {
            init: function () {
                $scope.slide_1 = {
                    is_show: false,
                    image1: '',
                    image2: ''
                };
                $scope.slide_2 = {
                    is_show: false,
                    image1: '',
                    image2: '',
                    image3: '',
                    image4: '',
                    image5: ''
                };
                $scope.slide_3 = {
                    is_show: false,
                    image1: '',
                    image2: '',
                    image3: '',
                    image4: '',
                    image5: ''
                };
                $scope.slide_5 = {
                    is_show: false,
                    image1: '',
                    image2: ''
                };

            },
            animate_1: function (type) {
                if (type == true) {
                    $scope.slide_1 = {
                        is_show: true,
                        image1: 'character-fadeIn',
                        image2: 'hello-fadeIn'
                    };

                    $scope.slide_2 = {
                        is_show: false,
                        image1: 'character1-fadeIn',
                        image2: 'text-fadeIn',
                        image3: 'award-fadeIn',
                        image4: 'breadcrumb-fadeIn',
                        image5: 'button-fadeIn'
                    };

                    $timeout(function () {
                        $rootScope.drawPercentageChart('home.home', $scope.index_array, 1);
                        $scope.index_array++;
                        $scope.slide_1 = {
                            is_show: true,
                            image1: 'character-fadeOut',
                            image2: 'hello-fadeOut'
                        };
                    }, 5000);

                    $timeout(function () {
                        $scope.slide_2.is_show = true;
                        $scope.enable_btn_action = true;
                        myBreadcrumb.show();
                    }, 5500);
                }

            },
            animate_2: function (type) {
                if (type == true) {
                    $timeout(function () {
                        $scope.slide_2 = {
                            is_show: true,
                            image1: 'character1-fadeOut',
                            image2: 'text-fadeOut',
                            image3: 'award-fadeOut',
                            image4: 'breadcrumb-fadeOut',
                            image5: 'button-fadeOut'
                        };
                    }, 500);
                }

                $scope.slide_3 = {
                    is_show: false,
                    image1: 'lisa-fadeIn',
                    image2: 'menu-fadeIn',
                    image3: 'line-fadeIn',
                    image4: 'hide',
                    image5: 'hide'
                };

                $timeout(function () {
                    $scope.slide_3.is_show = true;
                    $scope.enable_btn_action = false;
                    myBreadcrumb.show();
                }, 1000);

                $timeout(function () {
                    $scope.slide_3 = {
                        is_show: true,
                        image2: 'menu-fadeOut',
                        image3: 'line-fadeOut',
                        image4: 'menu-fadeIn',
                        image5: 'line-fadeIn'
                    };
                }, 4500);

                $timeout(function () {
                    $scope.slide_3 = {
                        is_show: true,
                        image1: 'lisa-fadeOut',
                        image2: 'menu-fadeOut',
                        image3: 'line-fadeOut',
                        image4: 'menu-fadeOut',
                        image5: 'line-fadeOut'
                    };
                }, 8000);

                $scope.slide_5 = {
                    is_show: false,
                    image2: 'board-fadeIn'
                };

                $timeout(function () {
                    $rootScope.drawPercentageChart('home.home', $scope.index_array, 1);
                    $scope.index_array++;
                    $scope.slide_5.is_show = true;
                    $scope.enable_btn_action = true;
                    myBreadcrumb.show();
                }, 9000);

            }
        };

        $rootScope.intro = {
            is_loading: true,
            init_animate: function(type) {
                introduction.initAnimation.animate_1(type)
            }
        };

        var stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                var timer = $timeout(function() {
                    if (!angular.element('#menu-modal').hasClass('ng-hide')) {
                        angular.element('.menu-toggle').click();
                    }
                    $timeout.cancel(timer); //remove timeout
                });
                $scope.$on('$destroy', stateListener); //remove listener after called
            });
    }
]).directive('imagepreload', ['$rootScope' ,'$timeout',function($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    $rootScope.intro.is_loading = false;
                    $timeout(function () {
                        $rootScope.intro.init_animate(true);
                    }, 1500);

                });
                element.bind('error', function(){

                });
            }
        };
    }]);