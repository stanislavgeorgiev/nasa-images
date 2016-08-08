(function () {
    'use strict';

    angular
            .module('nasaImagesApp.search', ['ngRoute'])
            .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.when('/', {
                        templateUrl: 'search/search.html',
                        controller: 'SearchCtrl',
                        controllerAs: 'search'
                    });
                }])
            .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', 'imagesService', '$location', '$routeParams'];

    function SearchCtrl($scope, imagesService, $location, $routeParams) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.photos = [];

        vm.searchDateTypes = [{value: 'date_uploaded', display: 'Date Uploaded'}, {value: 'date_taken', display: 'Date Taken'}];
        vm.searchInOptions = [{value: 'all', display: 'Everywhere'}, {value: 'tags', display: 'Tags Only'}];
        vm.sortOptions = [{value: 'relevant', display: 'Relevant'}, {value: 'date_uploaded', display: 'Date Uploaded'}, {value: 'date_taken', display: 'Date Taken'}, {value: 'interesting', display: 'Interesting'}];

        vm.query = {
            q: $routeParams.q,
            searchDateType: vm.searchDateTypes[0].value,
            fromDate: null,
            toDate: null,
            searchIn: vm.searchInOptions[0].value,
            sort: vm.sortOptions[0].value,
            page: 1,
            perPage: 48
        };

        vm.search = search;
        vm.loadMore = loadMore;
        vm.showPhoto = showPhoto;
        
        vm.search();
        
        /////////////////////

        $scope.$watch("query", function (newValue, oldValue) {
            vm.search();
        }, true);

        //////////////////
        
        function search() {
            imagesService.query(vm.query).then(function (data) {
                vm.photos = data;
            });
        }
        
        function loadMore() {
            vm.query.page++;
        }
        
        function showPhoto(photo) {
            imagesService.selected(photo);
            $location.url('/photo/' + photo.id);
        };
    }

})();