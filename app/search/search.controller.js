'use strict';

angular
        .module('nasaImagesApp.search', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/', {
                    templateUrl: 'search/search.html',
                    controller: 'SearchCtrl'
                });
            }])
        .controller('SearchCtrl', SearchCtrl);

SearchCtrl.$inject = ['$scope', 'imagesService', '$location', '$routeParams'];

function SearchCtrl($scope, imagesService, $location, $routeParams) {
    $scope.photos = [];

    $scope.searchDateTypes = [{value: 'date_uploaded', display: 'Date Uploaded'}, {value: 'date_taken', display: 'Date Taken'}];
    $scope.searchInOptions = [{value: 'all', display: 'Everywhere'}, {value: 'tags', display: 'Tags Only'}];
    $scope.sortOptions = [{value: 'relevant', display: 'Relevant'}, {value: 'date_uploaded', display: 'Date Uploaded'}, {value: 'date_taken', display: 'Date Taken'}, {value: 'interesting', display: 'Interesting'}];

    $scope.query = {
        q: $routeParams.q,
        searchDateType: $scope.searchDateTypes[0].value,
        fromDate: null,
        toDate: null,
        searchIn: $scope.searchInOptions[0].value,
        sort: $scope.sortOptions[0].value,
        page: 1,
        perPage: 48
    };

    $scope.search = function () {
        imagesService.query($scope.query).then(function (data) {
            $scope.photos = data;
        });
    };

    $scope.$watch("query", function (newValue, oldValue) {
        $scope.search();
    }, true);

    $scope.loadMore = function () {
        $scope.query.page++;
    };

    $scope.showPhoto = function (photo) {
        imagesService.selected(photo);
        $location.url('/photo/' + photo.id);
    };

    $scope.search();
}