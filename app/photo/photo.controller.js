(function () {
    'use strict';

    angular
            .module('nasaImagesApp.photo', ['ngRoute'])
            .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.when('/photo/:id', {
                        templateUrl: 'photo/photo.html',
                        controller: 'PhotoCtrl',
                        controllerAs: 'photo'
                    });
                }])
            .controller('PhotoCtrl', PhotoCtrl);

    PhotoCtrl.$inject = ['imagesService', '$location', '$routeParams', '$sce'];

    function PhotoCtrl(imagesService, $location, $routeParams, $sce) {
        
        /* jshint validthis: true */
        var vm = this;

        imagesService.get($routeParams.id).then(function (photo) {
            angular.extend(vm, photo);
        });

        vm.showNavLinks = imagesService.photos().photo.length > 0;

        vm.showPhoto = function (photo) {
            if (photo) {
                imagesService.selected(photo);
                $location.url('/photo/' + photo.id);
            } else {
                $location.url('/');
            }
        }

        vm.prev = function () {
            if (vm.showNavLinks) {
                vm.showPhoto(imagesService.getPrevPhoto());
            } else {
                $location.url('/');
            }
        };

        vm.next = function () {
            if (vm.showNavLinks) {
                vm.showPhoto(imagesService.getNextPhoto());
            } else {
                $location.url('/');
            }
        };

        vm.showDescription = function () {
            var description = '';
            if (vm.description)
                description = $sce.trustAsHtml(vm.description._content);
            
            return description;
        }

    }

})();