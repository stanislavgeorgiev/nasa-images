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

        vm.showNavLinks = imagesService.photos().photo.length > 0;

        vm.showDescription = showDescription;
        vm.showPhoto = showPhoto;
        vm.prev = prev;
        vm.next = next;

        activate();

        //////////////////

        function activate() {
            imagesService.get($routeParams.id).then(function (photo) {
                angular.extend(vm, photo);
            });
        }

        function prev() {
            if (vm.showNavLinks) {
                vm.showPhoto(imagesService.getPrevPhoto());
            } else {
                $location.url('/');
            }
        }

        function next() {
            if (vm.showNavLinks) {
                vm.showPhoto(imagesService.getNextPhoto());
            } else {
                $location.url('/');
            }
        }

        function showDescription() {
            var description = '';
            if (vm.description)
                description = $sce.trustAsHtml(vm.description._content);

            return description;
        }

        function showPhoto(photo) {
            if (photo) {
                imagesService.selected(photo);
                $location.url('/photo/' + photo.id);
            } else {
                $location.url('/');
            }
        }

    }

})();