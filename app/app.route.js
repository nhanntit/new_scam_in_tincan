'use strict';

angular.module('mainApp').config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('introduction', {
        url: '/home?landing_slide',
        templateUrl: 'scam_training/templates/introduction/index.html',
        controller: 'IntroductionController as introduction'
        })
        // Manage achievement for student
        .state('achievement', {
            url: '/achievement',
            templateUrl: 'scam_training/templates/achievement/index.html',
            controller: 'AchievementController as achieve'
        })
      // Definition section training
      .state('definitions', {
        url: '/definitions',
        templateUrl: 'scam_training/templates/definitions/index.html',
        controller: 'DefinitionController'
      })
        .state('definitions.definitions', {
            url: '/definitions'
        })
        .state('definitions.phishing', {
            url: '/phishing'
        })
        .state('definitions.spear_phishing', {
            url: '/spear_phishing'
        })
        .state('definitions.cc_and_bc', {
            url: '/cc_and_bc'
        })
        .state('definitions.ip_addresses', {
            url: '/ip_addresses'
        })
        .state('definitions.domain_names', {
            url: '/domain_names'
        })
        .state('definitions.url', {
            url: '/url',
            params:{
                slide: 3
            }
        })
        // Sender section training
      .state('sender', {
        url: '/sender?landing_slide',
        templateUrl: 'scam_training/templates/senders/index.html',
        controller: 'SenderController as sender'
      })
        .state('sender.introduction', {
            url: '/introduction',
            templateUrl: 'scam_training/templates/senders/index.html',
            controller: 'SenderController'
        })
        .state('sender.ip_addresses', {
            url: '/ip_addresses',
            templateUrl: 'scam_training/templates/senders/index.html',
            controller: 'SenderController'
        })
        .state('sender.free_email_providers', {
            url: '/free_email_providers',
            templateUrl: 'scam_training/templates/senders/index.html',
            controller: 'SenderController'
        })
        .state('sender.unusual_domain_names', {
            url: '/unusual_domain_names',
            templateUrl: 'scam_training/templates/senders/index.html',
            controller: 'SenderController'
        })
        .state('sender.incorrect_addressee', {
            url: '/incorrect_addressee',
            templateUrl: 'scam_training/templates/senders/index.html',
            controller: 'SenderController'
        })
        // Content section training
      .state('content', {
        url: '/content?landing_slide',
        templateUrl: 'scam_training/templates/contents/index.html',
        controller: 'ContentController as content'
      })
        .state('content.introduction', {
            url: '/introduction',
            templateUrl: 'scam_training/templates/contents/index.html',
            controller: 'ContentController'
        })
        .state('content.grammatical_errors', {
            url: '/grammatical_errors',
            templateUrl: 'scam_training/templates/contents/index.html',
            controller: 'ContentController'
        })
        .state('content.urgency', {
            url: '/urgency',
            templateUrl: 'scam_training/templates/contents/index.html',
            controller: 'ContentController'
        })
        .state('content.expected', {
            url: '/expected',
            templateUrl: 'scam_training/templates/contents/index.html',
            controller: 'ContentController'
        })
        .state('content.confusion', {
            url: '/confusion',
            templateUrl: 'scam_training/templates/contents/index.html',
            controller: 'ContentController'
        })
        // Action section training
      .state('action', {
        url: '/action?landing_slide',
        templateUrl: 'scam_training/templates/actions/index.html',
        controller: 'ActionController as action'
      })
        .state('action.introduction', {
            url: '/introduction',
            templateUrl: 'scam_training/templates/actions/index.html',
            controller: 'ActionController'
        })
        .state('action.look_under_link', {
            url: '/look_under_link',
            templateUrl: 'scam_training/templates/actions/index.html',
            controller: 'ActionController'
        })
        .state('action.ip_address_unused', {
            url: '/ip_address_unused',
            templateUrl: 'scam_training/templates/actions/index.html',
            controller: 'ActionController'
        })
        .state('action.attachments', {
            url: '/attachments',
            templateUrl: 'scam_training/templates/actions/index.html',
            controller: 'ActionController'
        })
        .state('action.forms', {
            url: '/forms',
            templateUrl: 'scam_training/templates/actions/index.html',
            controller: 'ActionController'
        })
      // Manage section training
      .state('manage', {
        url: '/manage?landing_slide',
        templateUrl: 'scam_training/templates/manages/index.html',
        controller: 'ManageController as manage'
      })
        .state('manage.introduction', {
            url: '/introduction',
            templateUrl: 'scam_training/templates/manages/index.html',
            controller: 'ManageController'
        })
        .state('manage.dont_respond', {
            url: '/dont_respond',
            templateUrl: 'scam_training/templates/manages/index.html',
            controller: 'ManageController'
        })
        .state('manage.dont_do_anything', {
            url: '/dont_do_anything',
            templateUrl: 'scam_training/templates/manages/index.html',
            controller: 'ManageController'
        })
        .state('manage.contact_help', {
            url: '/contact_help',
            templateUrl: 'scam_training/templates/manages/index.html',
            controller: 'ManageController'
        })
        .state('manage.relax', {
            url: '/relax',
            templateUrl: 'scam_training/templates/manages/index.html',
            controller: 'ManageController'
        })
       // Quiz management
      .state('quiz', {
          templateUrl: 'scam_training/templates/quiz/index.html',
          controller: 'QuizController as quiz'
      })
        .state('quiz.home', {
            url: '/home/quiz'
        })
        .state('quiz.definitions', {
            url: '/definitions/quiz'
        })
        .state('quiz.sender', {
            url: '/sender/quiz'
        })
        .state('quiz.content', {
            url: '/content/quiz'
        })
        .state('quiz.action', {
            url: '/action/quiz'
        })
        .state('quiz.manage', {
            url: '/manage/quiz'
        })
  }
]);