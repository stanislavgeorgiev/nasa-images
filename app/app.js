'use strict';

// Declare app level module which depends on views, and components
angular.module('nasaImagesApp', [
    'ngRoute',
    'ngAnimate',
    'ngMaterial',
    'ngResource',
    'nasaImagesApp.feed',
    'nasaImagesApp.app-loading',
])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
                $locationProvider.hashPrefix(); // Removes index.html in URL
                $routeProvider.otherwise({redirectTo: '/'});
            }]);
