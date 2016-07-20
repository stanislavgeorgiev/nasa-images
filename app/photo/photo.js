'use strict';

angular.module('nasaImagesApp.photo', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/photo/:id', {
        templateUrl: 'photo/photo.html',
        controller: 'PhotoCtrl'
    });
}])

.controller('PhotoCtrl', ['$scope', 'imagesService', '$location', '$routeParams', '$sce', function ($scope, imagesService, $location, $routeParams, $sce) {
    
    imagesService.get($routeParams.id).then(function(photo) {
        $scope.photo = photo;
    });
    
    $scope.showNavLinks = imagesService.photos().photo.length > 0;
    
    $scope.showPhoto = function(photo) {
        if (photo) {
            imagesService.selected(photo);
            $location.url('/photo/' + photo.id);
        } else {
            $location.url('/');
        }
    }
    
    $scope.prev = function() {
        if ($scope.showNavLinks) {
            $scope.showPhoto(imagesService.getPrevPhoto());
        } else {
            $location.url('/');
        }
    };
    
    $scope.next = function() {
        if ($scope.showNavLinks) {
            $scope.showPhoto(imagesService.getNextPhoto());
        } else {
            $location.url('/');
        }
    };
    
    $scope.showDescription = function() {
        return $sce.trustAsHtml($scope.photo.description._content);
    }
    
}]);