'use strict';

angular.module('mainApp')
  .constant('SCAM_CONSTANT', {
    TOTAL_STATIC_SLIDE: 80,
    CONS1: 1,
    CONS2: 2,
    COLOR_TEXT_PERCENTAGE: '#00869a',
    COLOR_BACKGROUND_PERCENTAGE: '#b5eaf2',
    COLOR_BACKGROUND_UNFILL_PERCENTAGE: '#ffffff',

    DEFINITION_STATIC_SLIDE_ARRAY: ['1-23-slide.jpg','1-24-slide.jpg','1-25-slide.jpg','1-26-slide.jpg',
        '1-27-slide.jpg','1-28-slide.jpg','1-29-slide.jpg','1-30-slide.jpg','1-31-slide.jpg',
        '1-32-slide.jpg','1-33-slide.jpg','1-34-slide.jpg','1-35-slide.jpg','1-36-slide.jpg',
        '1-37-slide.jpg','1-38-slide.jpg','1-39-slide.jpg','1-40-slide.jpg'],

    CUSTOM_DEFINITION_STATIC_SLIDE_ARRAY: ['1-23-slide.jpg','1-24-slide.jpg','srg-slides/1-25-slide.jpg','srg-slides/1-26-slide.jpg',
        'srg-slides/1-27-slide.jpg','1-28-slide.jpg','1-29-slide.jpg','1-30-slide.jpg','1-31-slide.jpg',
        '1-32-slide.jpg','1-33-slide.jpg','1-34-slide.jpg','1-35-slide.jpg','1-36-slide.jpg',
        '1-37-slide.jpg','1-38-slide.jpg','1-39-slide.jpg','1-40-slide.jpg'],

    IMAGE_ACHIEVEMENTS_ARRAY: ['achievements/BadgePopUPManage.png','achievements/Star3-Small.png',
        'achievements/iconBadge_Invisible_action.png','achievements/Star2-Small.png',
        'achievements/BadgePopUPContent.png','achievements/BadgePopUPSender.png','achievements/BadgePopUPDefinition.png',
        'achievements/BadgePopUPLisa.png','achievements/BadgePopUPLevel1.png','achievements/Star3-Medium.png',
        'achievements/Cup-1.png','achievements/bg_achivement.jpg','achievements/bg-Cup.png','slides/ThankYou.jpg',
        'achievements/label-achivement-cup.png', 'achievements/iconBadge_Invisible_level1.png',
        'achievements/cup-disable.png','icons/btn_share_fb.png','icons/btn_share_twitter.png'],

    SENDER_IMAGE_BACKGROUND: ['1-46-bg.jpg', '1-46-character.png', '1-46-board.png'],

    CONTENT_IMAGE_BACKGROUND: ['1-61-bg.jpg', '1-61-board.png', '1-61-character.png'],

    ACTION_IMAGE_BACKGROUND: ['1-75-bg.jpg', '1-75-Board.png', '1-75-Character.png', 'slides/action/slide82-bg.jpg',
        'slides/action/slide78-bg.jpg', 'slides/action/slide86-bg.jpg'],

    MANAGE_IMAGE_BACKGROUND: ['1-92-bg.jpg', '1-92-board.png', '1-92-character.png'],

    CONTENT_SLIDE_CONFIG :{
        quiz: ['quiz/Quiz_Carol.jpg'],
        introduction: ['content/1-62-slide.jpg','content/1-63-slide.jpg','content/1-64-slide.jpg'],
        grammatical_errors: ['content/1-65-slide.jpg'],
        urgency: ['content/1-66-slide.jpg'],
        expected: ['content/1-67-slide.jpg'],
        confusion: ['content/1-68-slide.jpg']
    },

    CUSTOM_CONTENT_SLIDE_CONFIG: {
        quiz: ['quiz/Quiz_Carol.jpg'],
        introduction: ['content/1-62-slide.jpg','content/1-63-slide.jpg','content/1-64-slide.jpg'],
        grammatical_errors: ['content/1-65-slide.jpg'],
        urgency: ['content/1-66-slide.jpg'],
        expected: ['content/1-67-slide.jpg'],
        confusion: ['content/1-68-slide.jpg']
    },

    ACTION_SLIDE_CONFIG :{
        quiz: [{
            is_static_slide:true,
            data: 'quiz/Quiz-Axel.jpg'
        }],
        background_action:[{
            is_static_slide:true,
            data: 'action/slide81-1-bg.jpg'
        }],
        introduction:[{
            is_static_slide:true,
            data: 'action/1-76-slide.jpg'
        }],
        look_under_link: [{
            is_static_slide: true,
            data: 'action/1-76-slide.jpg'
        },{
            is_static_slide: false,
            data: '_item1_2.html'
        },
        {
            is_static_slide: false,
            data: '_item1.html'
        }],
        ip_address_unused: [{
            is_static_slide: false,
            data: '_item2.html'
        }],
        attachments: [{
            is_static_slide: true,
            data: 'action/1-82-slide.jpg'
        },{
            is_static_slide: true,
            data: 'action/1-83-slide.jpg'
        }],
        forms: [{
            is_static_slide: false,
            data: '_item4.html'
        }]
    },

    CUSTOM_ACTION_SLIDE_CONFIG: {
        quiz: [{
            is_static_slide:true,
            data: 'quiz/Quiz-Axel.jpg'
        }],
        background_action:[{
            is_static_slide:true,
            data: 'action/slide81-1-bg.jpg'
        }],
        introduction:[{
            is_static_slide:true,
            data: 'action/1-76-slide.jpg'
        }],
        look_under_link: [{
            is_static_slide: true,
            data: 'action/1-76-slide.jpg'
        },{
            is_static_slide: false,
            data: '_item1_2.html'
        },
            {
                is_static_slide: false,
                data: '_item1.html'
            }],
        ip_address_unused: [{
            is_static_slide: false,
            data: '_item2.html'
        }],
        attachments: [{
            is_static_slide: true,
            data: 'action/1-82-slide.jpg'
        },{
            is_static_slide: true,
            data: 'action/1-83-slide.jpg'
        }],
        forms: [{
            is_static_slide: false,
            data: '_item4.html'
        }]
    },

    SENDER_SLIDE_CONFIG :{
        quiz: ['quiz/Quiz_Smiley.jpg'],
        introduction: ['sender/1-47-slide.jpg'],
        ip_addresses: ['sender/1-48-slide.jpg'],
        free_email_providers: ['sender/1-49-slide.jpg','sender/1-50-slide.jpg'],
        unusual_domain_names: ['sender/1-51-slide.jpg','sender/1-52-slide.jpg'],
        incorrect_addressee: ['sender/1-53-slide.jpg','sender/1-54-slide.jpg','sender/1-55-slide.jpg']
    },

    CUSTOM_SENDER_SLIDE_CONFIG :{
        quiz: ['quiz/Quiz_Smiley.jpg'],
        introduction: ['sender/1-47-slide.jpg'],
        ip_addresses: ['sender/1-48-slide.jpg'],
        free_email_providers: ['sender/1-49-slide.jpg','sender/srg-slides/1-50-slide.jpg'],
        unusual_domain_names: ['sender/1-51-slide.jpg','sender/1-52-slide.jpg'],
        incorrect_addressee: ['sender/1-53-slide.jpg','sender/1-54-slide.jpg','sender/1-55-slide.jpg']
    },

    //Constant for Manage Controller
    MANAGE_SLIDE_CONFIG : {
        quiz: [{
            is_static_slide:true,
            data: 'quiz/Quiz-Millie.jpg'
        }],
        background_action:[{
            is_static_slide:true,
            data: 'manage/1-98-slide-bg.jpg'
        }],
        introduction:[{
            is_static_slide: true,
            data: 'manage/1-93-slide.jpg'
        }],
        dont_respond: [{
            is_static_slide: true,
            data: 'manage/1-94-slide.jpg'
        }],
        dont_do_anything: [{
            is_static_slide: true,
            data: 'manage/1-95-slide.jpg'
        }],
        contact_help: [{
            is_static_slide: true,
            data: 'manage/1-96-slide.jpg'
        }, {
            is_static_slide: true,
            data: 'manage/1-97-slide.jpg'
        }, {
            is_static_slide: false,
            data: '_opt2.html'
        }],
        relax: [{
            is_static_slide: true,
            data: 'manage/1-99-slide.jpg'
        }]
    },

    CUSTOM_MANAGE_SLIDE_CONFIG : {
        quiz: [{
            is_static_slide:true,
            data: 'quiz/Quiz-Millie.jpg'
        }],
        background_action:[{
            is_static_slide:true,
            data: 'manage/1-98-slide-bg.jpg'
        }],
        introduction:[{
            is_static_slide: true,
            data: 'manage/1-93-slide.jpg'
        }],
        dont_respond: [{
            is_static_slide: true,
            data: 'manage/1-94-slide.jpg'
        }],
        dont_do_anything: [{
            is_static_slide: true,
            data: 'manage/1-95-slide.jpg'
        }],
        contact_help: [{
            is_static_slide: true,
            data: 'manage/1-96-slide.jpg'
        }, {
            is_static_slide: true,
            data: 'manage/1-97-slide.jpg'
        }, {
            is_static_slide: false,
            data: '_opt2.html'
        }],
        relax: [{
            is_static_slide: true,
            data: 'manage/1-99-slide.jpg'
        }]
    },

    INTRO_SLIDE_CONFIG: {
        introduction: [{
            is_static_slide: true,
            data: 'introductions/Slide0.jpg'
        }, {
            is_static_slide: true,
            data: 'introductions/Slide1.jpg'
        },{
            is_static_slide: false,
            data: '_intro2.html'
        },{
            is_static_slide: true,
            data: 'introductions/Slide3.jpg'
        },{
            is_static_slide: true,
            data: 'introductions/Slide4.jpg'
        },{
            is_static_slide: true,
            data: 'introductions/Slide5.jpg'
        }]
    },

    CUSTOM_INTRO_SLIDE_CONFIG: {
        introduction: [{
            is_static_slide: true,
            data: 'introductions/Slide0.jpg'
        }, {
            is_static_slide: true,
            data: 'introductions/srg-slides/Slide1.jpg'
        },{
            is_static_slide: false,
            data: '_intro2.html'
        },{
            is_static_slide: true,
            data: 'introductions/Slide3.jpg'
        },{
            is_static_slide: true,
            data: 'introductions/Slide4.jpg'
        },{
            is_static_slide: true,
            data: 'introductions/Slide5.jpg'
        }]
    },

    STATIC_SLIDE_INDEX: {
        home: {
            home: 10
        },
        definitions : {
            definitions : 1,
            phishing : 3,
            spear_phishing : 1,
            cc_and_bc : 3,
            ip_addresses : 1,
            domain_names : 2,
            url : 7
        },

        content : {
            introduction : 4,
            grammatical_errors : 1,
            urgency : 1,
            expected : 1,
            confusion : 1
        },

        action : {
            introduction : 1,
            look_under_link : 3,
            ip_address_unused : 1,
            attachments : 2,
            forms : 1
        },

        sender : {
            introduction : 2,
            ip_addresses : 1,
            free_email_providers : 2,
            unusual_domain_names : 2,
            incorrect_addressee : 3
        },

        manage : {
            introduction : 2,
            dont_respond : 1,
            dont_do_anything : 1,
            contact_help : 3,
            relax : 1
        }
    },

    MENU_HOME_NAME_ARRAY: ['Content', 'Quiz'],
    MENU_DEFINITION_NAME_ARRAY: ['Introduction', 'Phishing', 'Spear-Phishing','CC & BCC','IP Addresses','Domain names','URL', 'Quiz'],
    MENU_SENDER_NAME_ARRAY: ['Introduction','Slimey Trick #1', 'Slimey Trick #2', 'Slimey Trick #3', 'Slimey Trick #4','Quiz'],
    MENU_CONTENT_NAME_ARRAY: ['Introduction','Lesson #1', 'Lesson #2', 'Lesson #3', 'Lesson #4','Quiz'],
    MENU_ACTION_NAME_ARRAY: ['Introduction','Action Item #1', 'Action Item #2', 'Action Item #3', 'Action Item #4','Quiz'],
    MENU_MANAGE_NAME_ARRAY: ['Introduction','Directive #1', 'Directive #2', 'Directive #3', 'Directive #4','Quiz'],

    QUIZ_STYLE_COLOR : {
        introduction: 'blue' ,
        definitions: 'blue',
        sender: 'grey',
        content: 'pink',
        action: 'red',
        manage: 'green'
    },
    QUIZ_STATE:['home','definitions','sender','content','action','manage','achievement'],

    NAME_OF_PAGE: {
        home : 'Content',
        definitions : 'Definitions - Introduction',
        introduction : 'Introduction',
        phishing : 'Phishing',
        spear_phishing : 'Spear-Phishing',
        cc_and_bc : 'CC & BCC',
        ip_addresses : 'IP Addresses',
        domain_names : 'Domain names',
        url : 'URL',
        free_email_providers : 'Slimey Trick #2',
        unusual_domain_names : 'Slimey Trick #3',
        incorrect_addressee : 'Slimey Trick #4',
        grammatical_errors : 'Lesson #1',
        urgency : 'Lesson #2',
        expected : 'Lesson #3',
        confusion : 'Lesson #4',
        look_under_link : 'Action Item #1',
        ip_address_unused : 'Action Item #2',
        attachments : 'Action Item #3',
        forms : 'Action Item #4',
        dont_respond : 'Directive #1',
        dont_do_anything : 'Directive #2',
        contact_help : 'Directive #3',
        relax : 'Directive #4'
    }

  });