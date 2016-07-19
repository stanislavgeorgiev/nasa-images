'use strict';

// Declare app level module which depends on views, and components
angular.module('nasaImagesApp', [
    'ngRoute',
    'ngAnimate',
    'ngMaterial',
    'ngResource',
    'nasaImagesApp.feed',
    'nasaImagesApp.photo',
    'nasaImagesApp.app-loading',
])
.config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function ($locationProvider, $routeProvider, $mdThemingProvider) {
    $locationProvider.hashPrefix(); // Removes index.html in URL
    $routeProvider.otherwise({redirectTo: '/'});

    $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('orange');
}])
.controller('AppCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.pageLoading = false;
    
    $rootScope.$on('apiCallBegin', function() {
        $scope.pageLoading = true;
    });
    
    $rootScope.$on('apiCallEnd', function() {
        $scope.pageLoading = false;
    });
    
    $rootScope.$on('apiCallError', function() {
        $scope.pageLoading = false;
        
    });
}]);
