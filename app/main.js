// Import angular
import 'angular';
// Material design css

// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';
// Our modules
import authService from './shared/services/authenticationService';
import profileService from './shared/services/profileService';
import registerController from './components/register/register';
import loginController from './components/login/login';
import profileController from './components/profile/profile';
import adminController from './components/admin/admin';
import directives from './shared/directives/directives';

// css
import 'angular-material/angular-material.css';
import '../assets/css/style.css';

function config($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider, $mdThemingProvider, $mdIconProvider) {
    $compileProvider.debugInfoEnabled(false);

    $urlRouterProvider.otherwise('/');

    function authenticate($q, authService, $state, $timeout) {
        if (authService.currentUser().role === 'manager') {
            return $q.when();
        } else {
            $timeout(function() {
                $state.go('login');
            });
            return $q.reject();
        }
    }

    $stateProvider
        .state('login', {
            url: '/',
            controllerAs: 'vm',
            controller: ['$state', 'authService', loginController],
            template: require('./components/login/login.html'),
            authenticate: false,
        })
        .state('register', {
            url: '/register',
            controllerAs: 'vm',
            controller: ['$state', 'authService', registerController],
            template: require('./components/register/register.html'),
            authenticate: false,
        })
        .state('profile', {
            url: '/profile',
            controllerAs: 'vm',
            controller: ['$scope', '$state', '$mdDialog', '$mdMedia', '$q', '$timeout', '$window', 'profileService', 'authService', profileController],
            template: require('./components/profile/profile.html'),
            authenticate: true,
        })
        .state('admin', {
            url: '/admin',
            controllerAs: 'vm',
            controller: ['$mdBottomSheet', '$mdSidenav', '$mdDialog', '$state', '$q', 'authService', 'profileService', adminController],
            template: require('./components/admin/admin.html'),
            resolve: { authenticate: ['$q', 'authService', '$state', '$timeout', authenticate] },
            authenticate: true,
        })
        .state('getFile', {
            url: '/api/getFile/:id',
            authenticate: true,
        });

    $locationProvider.html5Mode(true);



    // theming
    var customBlueMap = $mdThemingProvider.extendPalette('indigo', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff',
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50',
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');

    $mdIconProvider
        // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
        .iconSet('action', require('../assets/icons/svg-sprite-action.svg'), 24)
        .iconSet('alert', require('../assets/icons/svg-sprite-alert.svg'), 24)
        .iconSet('av', require('../assets/icons/svg-sprite-av.svg'), 24)
        .iconSet('communication', require('../assets/icons/svg-sprite-communication.svg'), 24)
        .iconSet('content', require('../assets/icons/svg-sprite-content.svg'), 24)
        .iconSet('device', require('../assets/icons/svg-sprite-device.svg'), 24)
        .iconSet('editor', require('../assets/icons/svg-sprite-editor.svg'), 24)
        .iconSet('file', require('../assets/icons/svg-sprite-file.svg'), 24)
        .iconSet('hardware', require('../assets/icons/svg-sprite-hardware.svg'), 24)
        .iconSet('image', require('../assets/icons/svg-sprite-image.svg'), 24)
        .iconSet('maps', require('../assets/icons/svg-sprite-maps.svg'), 24)
        .iconSet('navigation', require('../assets/icons/svg-sprite-navigation.svg'), 24)
        .iconSet('notification', require('../assets/icons/svg-sprite-notification.svg'), 24)
        .iconSet('social', require('../assets/icons/svg-sprite-social.svg'), 24)
        .iconSet('toggle', require('../assets/icons/svg-sprite-toggle.svg'), 24)

        // // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
        .iconSet('avatars', require('../assets/icons/avatar-icons.svg'), 24)
        .defaultIconSet(require('../assets/icons/svg-sprite-action.svg'), 24);

}

function run($rootScope, $state, authService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !authService.isLoggedIn()) {
            // User isn’t authenticated
            $state.transitionTo('login');
            event.preventDefault();
        }
    });
}

const app = angular
    .module('skillApp', [
        angularMaterial,
        angularAnimate,
        angularUIRouter,
        authService.name,
        profileService.name,
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider', '$mdThemingProvider', '$mdIconProvider', config])
    .run(['$rootScope', '$state', 'authService', run]);

directives(app);
