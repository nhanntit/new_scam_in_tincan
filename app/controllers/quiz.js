'use strict';

angular.module('mainApp').controller('QuizController', ['$scope', '$http', 'quizService', '$timeout',
    'SCAM_CONSTANT', '$stateParams', '$state', '$rootScope',
    function($scope, $http, quizService, $timeout, SCAM_CONSTANT, $stateParams, $state, $rootScope) {
        var quiz = this;
        var cur_section = $state.current.name.split('.')[1];
        quiz.styles = SCAM_CONSTANT.QUIZ_STYLE_COLOR;
        quiz.states = SCAM_CONSTANT.QUIZ_STATE;
        quiz.config = {
            is_loader: true,
            show_content: false,
            show_modal: false,
            setup_question: true,
            hide_logo: true
        };
        quiz.data = {
            submit_answer: [],
            user_data: [],
            user_cid:[]
        };

        var icur = 0;


        //Get Quiz
        quiz.getQuizzes = function(section){
            return SCAM_CONSTANT.QUIZ_INFO;
        };
        
        // //Get Quiz
        // quiz.getQuizzes = function(section){
        //     quizService.getRandomQuizzes(section)
        //         .then(function(result){
        //             quiz.config.is_loader = false;
        //             quiz.config.show_content = true;
        //             quiz.quizzes = result.data;
        //             if(isNaN(result.data.quiz.quiz_training_section_id))
        //             {
        //                 quiz.config.setup_question = false;
        //                 return;
        //             }
        //             quiz.quiz_attrs = quiz.initialQuizAttrs(result.data);
        //             quiz.setCurrentQuiz(icur);
        //             quiz.setupNavigation();
        //         },
        //         function(result){
        //             quiz.config.setup_question = false
        //         });
        // };
        //Calculate percent for quiz
        quiz.correct_count = 0;
        quiz.getAchieIndex = function(data, section_name){
            var index = -1;
            angular.forEach(data.student_score, function(value, key) {
                if(value.section == section_name){
                    index = key;
                    return key;
                }
            });
            return index;
        };
        quiz.calc =  function(){
            if(quiz.data.submit_answer.length == 0) return;
            var total = 3;
            var section_name = ($state.current.url).split('/').filter(Boolean);
            //handle best score + achievement
            quiz.data.submit_answer.length == total ? ($rootScope.json_data['best_score']['sections'][section_name[0]]['is_done'] = true) : '';
            if(typeof($rootScope.json_data['best_score']['sections'][section_name[0]]) != 'undefined' && quiz.correct_count >= $rootScope.json_data['best_score']['sections'][section_name[0]]['score']){
                var achie_section_index = quiz.getAchieIndex($rootScope.achievement_data, section_name[0]);
                $rootScope.cup_icon_class = 'new-score';
                $rootScope.json_data['best_score']['sections'][section_name[0]]['score'] = quiz.correct_count;
                $rootScope.achievement_data.student_score[achie_section_index]['correct_count'] = quiz.correct_count;
                var correct_answers = 0, done_sections = 0, all_sections = 0;
                angular.forEach($rootScope.json_data['best_score']['sections'], function(section){
                    all_sections ++;
                    correct_answers += section['score'];
                    section['is_done'] ? done_sections++ : done_sections;
                });
                if(done_sections == all_sections){
                    $rootScope.json_data['best_score']['score'] = Math.round((correct_answers/$rootScope.json_data['best_score']['total'])*100);
                    $rootScope.best_score = $rootScope.json_data['best_score']['score'];
                }
            }
            //handle quiz score
            var percent = Math.round((quiz.correct_count / total) * 100);
            var q_index = $rootScope.json_data['all_training'][section_name[0]].length - 1;
            $rootScope.json_data['all_training'][section_name[0]][q_index]['quiz']['completed'] = true;
            if(percent > $rootScope.json_data['all_training'][section_name[0]][q_index]['quiz']['percentage']){
                $rootScope.json_data['all_training'][section_name[0]][q_index]['quiz']['percentage'] = percent;
            }
        };

        //Create Quiz attribute for all quiz
        quiz.initialQuizAttrs = function (quiz_data){

            var attr = {
                training_section_id: quiz_data.quiz.quiz_training_section_id,
                question_answers_attributes: []
            };
            for(var i = 0; i < quiz_data.quiz.questions.length; i++)
            {
                var answer_id = quiz_data.quiz.questions[i].selected_id;
                var question_answer = {
                    'question_id': quiz_data.quiz.questions[i].id,
                    'answer_id': answer_id
                };
                attr.question_answers_attributes.push(question_answer);
                if(typeof(answer_id) != "undefined"){
                    quiz.data.submit_answer.push(i);
                }
                quiz.data.user_data.push({
                    selected_id: answer_id,
                    answer_correct_id: quiz_data.quiz.questions[i].correct_id
                });
                if(typeof(answer_id) != 'undefined' && answer_id == quiz_data.quiz.questions[i].correct_id){
                    quiz.correct_count++;

                }
                quiz.data.user_cid.push(quiz_data.quiz.questions[i].cid);
            }

            return attr;
        };

        quiz.setCurrentQuiz = function(i){
            if(quiz.quizzes.quiz != null) {
                $scope.current_quiz = {
                    question: quiz.quizzes.quiz.questions[i].question,
                    index: quiz.quizzes.quiz.questions[i].index,
                    note: "Choose the correct answer. You can only choose one item.",
                    answer: quiz.quizzes.quiz.questions[i].answers,
                    last_selected: quiz.quiz_attrs.question_answers_attributes[i].answer_id,
                    is_submit: quiz.checkCanSubmit()
                };
            }
            //introduction and definition have only 2 elements in breadcrumb
            if(cur_section == 'home' || cur_section == 'definitions'){
                $scope.navigation.breadcrumb[1].name = 'Quiz #' + (icur + 1);
            }else{
                $scope.navigation.breadcrumb[2].name = 'Quiz #' + (icur + 1);
            }
            quiz.setupNavigation();

        };

        quiz.selectAnswer = function(question_index, select_id){
            if (quiz.data.submit_answer.indexOf(icur) != -1) return;
            quiz.quiz_attrs.question_answers_attributes[question_index].answer_id = select_id;
            quiz.setSelectedAnswer(select_id);
        };

        //$scope.selectAnswer = quiz.selectAnswer;

        //Remove all existing class and add new class
        quiz.setSelectedAnswer = function(selected_id){
            var answer_boxes = angular.element('.answer_box');
            answer_boxes.removeClass(quiz.section_style);
            var selected_element = angular.element('#answer_'+ selected_id);
            selected_element.addClass(quiz.section_style);
            $scope.current_quiz.is_submit = true;
            quiz.quiz_attrs.question_answers_attributes[icur].answer_id = selected_id;
        };

         quiz.loadFirstSlideNextSection = function(name){
             var array_background = [];
             var url_list = [];
             switch(name){
                 case 'home':
                     angular.forEach(SCAM_CONSTANT.DEFINITION_STATIC_SLIDE_ARRAY, function (value, key) {
                         url_list.push($rootScope.config_env.base_url + '/assets/scam_training/slides/definitions/' + value);
                     });
                     break;
                 case 'definitions':
                     angular.forEach(SCAM_CONSTANT.SENDER_IMAGE_BACKGROUND, function (value, key) {
                         array_background.push($rootScope.config_env.base_url + '/assets/scam_training/' + value);
                     });
                     $scope.loadStaticImage(array_background);

                     angular.forEach(SCAM_CONSTANT.SENDER_SLIDE_CONFIG, function (value, key) {
                         angular.forEach(value, function (val, k) {
                             url_list.push($rootScope.config_env.static_url + val);
                         });
                     });
                     break;
                 case 'sender':
                     angular.forEach(SCAM_CONSTANT.CONTENT_IMAGE_BACKGROUND, function (value, key) {
                         array_background.push($rootScope.config_env.base_url + '/assets/scam_training/' + value);
                     });
                     $scope.loadStaticImage(array_background);

                     angular.forEach(SCAM_CONSTANT.CONTENT_SLIDE_CONFIG, function(value, key) {
                         angular.forEach(value, function(val, k) {
                             url_list.push($rootScope.config_env.static_url + val)
                         });
                     });
                     break;
                 case 'content':
                     angular.forEach(SCAM_CONSTANT.ACTION_IMAGE_BACKGROUND, function (value, key) {
                         array_background.push($rootScope.config_env.base_url + '/assets/scam_training/' + value);
                     });
                     $scope.loadStaticImage(array_background);

                     angular.forEach(SCAM_CONSTANT.ACTION_SLIDE_CONFIG, function(value, key) {
                         angular.forEach(value, function(val, k) {
                             if (val.is_static_slide == true) {
                                 url_list.push($rootScope.config_env.static_url + val.data)
                             }
                         });
                     });
                     break;
                 case 'action':
                     angular.forEach(SCAM_CONSTANT.MANAGE_IMAGE_BACKGROUND, function (value, key) {
                         array_background.push($rootScope.config_env.base_url + '/assets/scam_training/' + value);
                     });
                     $scope.loadStaticImage(array_background);

                     angular.forEach(SCAM_CONSTANT.MANAGE_SLIDE_CONFIG, function(value, key) {
                         angular.forEach(value, function(val, k) {
                             if (val.is_static_slide == true) {
                                 url_list.push($rootScope.config_env.static_url + val.data)
                             }
                         });
                     });
                     break;
                 case 'manage':
                     angular.forEach(SCAM_CONSTANT.IMAGE_ACHIEVEMENTS_ARRAY, function (value, key) {
                         url_list.push($rootScope.config_env.base_url + '/assets/scam_training/' + value);
                     });
                     break;
             }
             $scope.loadStaticImage(url_list);
         };

        quiz.setCurrentBackground = function(name){
            var background_img = $rootScope.config_env.base_url + '/assets/scam_training/slides/quiz/';
            switch(name) {
                case 'sender':
                    background_img += 'Quiz_Smiley.jpg';
                    quiz.section_style = quiz.styles.sender;
                    break;
                case 'content':
                    background_img += 'Quiz_Carol.jpg';
                    quiz.section_style = quiz.styles.content;
                    break;
                case 'action':
                    background_img += 'Quiz-Axel.jpg';
                    quiz.section_style = quiz.styles.action;
                    break;
                case 'manage':
                    background_img += 'Quiz-Millie.jpg';
                    quiz.section_style = quiz.styles.manage;
                    break;
                default :
                    background_img += 'Quiz-Intro.jpg';
                    quiz.section_style = quiz.styles.introduction;
            }
            $scope.style = quiz.section_style;
            return background_img;
        };

        quiz.move = {
            next: 'disable',
            back: 'enable'
        };

        quiz.setupNavigation = function(){
            if(typeof(quiz.quiz_attrs.question_answers_attributes[icur].answer_id) != 'undefined')
            {
                if(quiz.data.submit_answer.indexOf(icur) != -1 && icur < 3) {
                    quiz.move.next = 'enable';
                    quiz.config.is_loader = false;
                }
                else{
                    quiz.move.next = 'disable';
                }
            }
            else { quiz.move.next = 'disable';}
            if(icur == 3) { quiz.move.next = 'disable';}
        };

        $scope.navigation.next = function() {
            if(quiz.data.submit_answer.indexOf(icur) == -1) return;
            quiz.goNextState();

            if(icur < 2) {
                icur++;
                quiz.setCurrentQuiz(icur);
                quiz.move.back = 'enable';
            }
        };

        $scope.navigation.back = function() {
            if(icur > 0) {
                icur--;
                quiz.setCurrentQuiz(icur);
                quiz.move.next = 'enable';
            }
            else{
                var section_routes = $rootScope.scam_training_pages[cur_section];
                if(section_routes != null) {
                    var last_section_page = section_routes[section_routes.length -1];
                    if(last_section_page != 'home'){
                        // remove these conditions if apply this logic for all sections
                        $rootScope.is_back_from_quiz = true;
                        $state.go(cur_section + "." + last_section_page);

                    }else {
                        $rootScope.is_back_from_quiz = true;
                        $state.go('introduction');
                    }
                }
            }
        };

        quiz.goNextState = function(){
            if(icur >= 2 ){
                var next_state = 'achievement';
                for(var i = 1; i < 6; i++) {
                    var next_section_index = quiz.states.indexOf(cur_section) + i;
                    var next_section = quiz.states[next_section_index];

                    if(typeof(next_section) != 'undefined') {
                        var next_actions = $rootScope.scam_training_pages[next_section];

                        if( next_actions != null && next_actions.length > 0) {
                            if(next_actions[0] == ''){
                                next_state = next_actions[1];
                            } else{
                                next_state = next_actions[0];
                            }
                            if(next_state != next_section){
                                next_state = next_section + "." + next_state;
                            }
                            $state.go(next_state);
                            return;
                        }
                    }
                }
                $state.go(next_state);
            }
        };

        //*******************************************
        quiz.result_data = {};

        quiz.checkCanSubmit = function(){
            if(typeof(quiz.quiz_attrs.question_answers_attributes[icur].answer_id) != 'undefined') {
                if(quiz.data.submit_answer.indexOf(icur) == -1) {
                    return true;
                }else { return false; }
            }else {
                return false;
            }
        };

        quiz.checkPercentage = function(){
            if(icur >= $scope.completedQuizzes[cur_section]) {
                $rootScope.drawPercentageChart($state.current.name, icur);
            }
        };

        quiz.submitAnswers = function(data){
            if (!quiz.checkCanSubmit()) return;
            var post_data = {
                'training_section_id': data.training_section_id,
                'question_answers_attributes': [data.question_answers_attributes[icur]]
            };
            quiz.config.is_loader = true;
            quiz.data.submit_answer.push(icur);
            $scope.current_quiz.is_submit = false;
            quiz.setResultData();
            quiz.setupNavigation();
            quiz.checkPercentage();
            quizService.postAnswers(post_data).then(function(return_data){
                    quiz.config.is_loader = false;
                    $rootScope.json_data['current_score'] = return_data.data.cur_score;
                    $rootScope.menu_current_score = return_data.data.cur_score == -1 ? '0' : Math.round(return_data.data.cur_score);
                },
                function(error){
                    quiz.config.is_loader = false;
                    quiz.data.submit_answer.pop();
                    $scope.current_quiz.is_submit = true;
                });
        };

        // Review result database
        quiz.setResultData = function(data){
            quiz.data.user_data[icur] = {
                answer_correct_id: quiz.data.user_cid[icur],
                selected_id: quiz.quiz_attrs.question_answers_attributes[icur].answer_id
            };
            if(quiz.data.user_data[icur].answer_correct_id ===  quiz.data.user_data[icur].selected_id){
                quiz.correct_count++;
            }
            $scope.current_quiz.last_selected = quiz.quiz_attrs.question_answers_attributes[icur].answer_id;
            quiz.config.show_modal = quiz.checkCompleted(quiz.data.user_data);
        };

        quiz.checkCompleted = function(user_data){
            if(icur == quiz.data.user_data.length - 1){
                var isAll = true;
                angular.forEach(user_data, function(value){
                    if(value.answer_correct_id != value.selected_id) {
                        isAll = false;
                    }
                });
                return isAll;
            }
            return false;
        };

        //Reset all varible for new quiz
        quiz.resetVariable = function(){
            icur = 0;
            quiz.data.submit_answer = [];
            quiz.data.user_data = [];
            quiz.data.user_cid = [];
            $rootScope.can_go_back = false;
            quiz.config.setup_question = true;
        };

        quiz.inIt = function(cur_section){
            quiz.resetVariable();
            quiz.quizzes = {};
            quiz.current_section = cur_section;
            quiz.background_img = quiz.setCurrentBackground(cur_section);
            quiz.getQuizzes(cur_section);

            //Setup breadcrumb
            var breadcrumb_section = cur_section[0].toUpperCase() + cur_section.slice(1);
            if(breadcrumb_section == 'Home'){
                breadcrumb_section = 'Introduction'
            }
            $scope.navigation.breadcrumb = [
                {
                    'name': 'S.C.A.M Training',
                    'href': '/home'
                },
                {
                    'name': breadcrumb_section,
                    'href': '/'+ cur_section
                },
                {
                    'name': 'Quiz #1',
                    'href': '/'+ cur_section + "/quiz"
                }
            ];

            //Introduction & definition section
            if(cur_section == 'home' || cur_section == 'definitions'){
                $scope.navigation.breadcrumb.shift();
                if(cur_section == 'home'){
                    $scope.navigation.breadcrumb[0]['name'] = 'Introduction';
                }
            }
        };

        var stateListener = $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                var timer = $timeout(function() {
                    if(!angular.element('#menu-modal').hasClass('ng-hide')){
                        angular.element('.menu-toggle').click();
                    }
                    $timeout.cancel(timer); //remove timeout
                });

                var controller = toState.name.split('.')[0];
                cur_section = toState.name.split('.')[1];
                if(cur_section != undefined && controller == 'quiz'){
                    quiz.config.is_loader = true;
                }

                $scope.$on('$destroy', stateListener);//remove listener after called

            });


        quiz.inIt(cur_section);
        quiz.loadFirstSlideNextSection(cur_section);
    }
]);
