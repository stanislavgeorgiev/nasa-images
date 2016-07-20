'use strict';

// Declare app level module which depends on views, and components
angular.module('nasaImagesApp', [
    'ngRoute',
    'ngAnimate',
    'ngMaterial',
    'ngResource',
    'nasaImagesApp.search',
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
.controller('AppCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
    $scope.pageLoading = false;
    $scope.q = $location.search().q;
    
    $rootScope.$on('apiCallBegin', function() {
        $scope.pageLoading = true;
    });
    
    $rootScope.$on('apiCallEnd', function() {
        $scope.pageLoading = false;
    });
    
    $rootScope.$on('apiCallError', function() {
        $scope.pageLoading = false; 
    });
    
    $scope.search = function() {
        $location.url('/?q=' + $scope.q);
    };
}]);
