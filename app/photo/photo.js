'use strict';

angular.module('nasaImagesApp.photo', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/photo/:id', {
        templateUrl: 'photo/photo.html',
        controller: 'PhotoCtrl'
    });
}])

.controller('PhotoCtrl', ['$scope', 'imagesService', '$routeParams', function ($scope, imagesService, $routeParams) {
    imagesService.get($routeParams.id).then(function(photo) {
        $scope.photo = photo;
    });
//    console.log($scope.photo);
    
}]);