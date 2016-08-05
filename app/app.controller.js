'use strict';

// Declare app level module which depends on views, and components
angular
        .module('nasaImagesApp')
        .controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ['$scope', '$rootScope', '$location'];

function AppCtrl($scope, $rootScope, $location) {
    $scope.pageLoading = false;
    $scope.q = $location.search().q;

    $rootScope.$on('apiCallBegin', function () {
        $scope.pageLoading = true;
    });

    $rootScope.$on('apiCallEnd', function () {
        $scope.pageLoading = false;
    });

    $rootScope.$on('apiCallError', function () {
        $scope.pageLoading = false;
    });

    $scope.search = function () {
        $location.url('/?q=' + $scope.q);
    };
}
