'use strict';

angular.module('nasaImagesApp.search', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'search/search.html',
        controller: 'SearchCtrl'
    });
}])

.service('imagesService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {
    var $this = {};
    $this.photos = null;
    $this.lastRequestParams = [];
    $this.selected = null;
    
    $this.perPage = 48;
    
    $this.resetPhotos = function() {
        $this.photos = {
            photo: [],
            page: 1,
            pages: 1,
            perpage: $this.perPage,
            total: 0
        };
    };
    
    $this.call = function(params) {
        $rootScope.$broadcast('apiCallBegin');
        
        var requestParams = angular.extend({
            api_key: '0e2b6aaf8a6901c264acb91f151a3350',
            format: "json",
            nojsoncallback: 1
        }, params);
        
        return $http.get('https://api.flickr.com/services/rest/', {params: requestParams})
                    .then(function(data) {
                        $rootScope.$broadcast('apiCallEnd');
                        return data.data;
                    })
                    .catch(function (data) {
                        $rootScope.$broadcast('apiCallError');
                    });
    };
    
    $this.query = function(params) {
        var requestParams = {
            method: "flickr.photos.search",
            user_id: "24662369@N07",
            media: "photos",
            text: "",
            tags: "",
            tag_mode: "all",
            sort: "date-posted-desc",
            page: 1,
            per_page: $this.perPage,
            extras: "description,url_b,url_n"
        };

        if (params.q && params.searchIn == 'tags') {
            requestParams.tags = params.q.replace(' ', ',');
            requestParams.tag_mode = 'all';
        } else
            requestParams.text = params.q;

        if (params.searchDateType && (params.fromDate || params.toDate)) {
            var fromDate = params.fromDate ? new Date(params.fromDate).toISOString().slice(0, 10) : null;
            var toDate = params.toDate ? new Date(params.toDate).toISOString().slice(0, 10) : null;

            if (params.searchDateType == 'date_uploaded') {
                requestParams.min_upload_date = fromDate;
                requestParams.max_upload_date = toDate;
            } else if (params.searchDateType == 'date_taken') {
                requestParams.min_taken_date =  fromDate;
                requestParams.max_taken_date = toDate;
            }
        }

        if (params.sort == 'relevant')
            requestParams.sort = 'relevance';
        else if (params.sort == 'date_uploaded')
            requestParams.sort = 'date-posted-desc';
        else if (params.sort == 'date_taken')
            requestParams.sort = 'date-taken-desc';
        else if (params.sort == 'interesting')
            requestParams.sort = 'interestingness-desc';
        
        if (params.page)
            requestParams.page = params.page;
        
        if (params.perPage)
            requestParams.per_page = params.perPage;

        if (JSON.stringify(requestParams) === JSON.stringify($this.lastRequestParams) && $this.photos.photo.length > 0) {
            //console.log('load cached');
            var defer = $q.defer();

            $timeout(function () {
                defer.resolve($this.photos);
            }, 0);

            return defer.promise;
        } else {
            console.log('load from server');
            $this.lastRequestParams = requestParams;

            return $this.call(requestParams)
                .then(function(data){
                    if (data.stat == 'ok' && requestParams.page > 1) {
                        $this.photos.photo = $this.photos.photo.concat(data.photos.photo);
                        $this.photos.page = requestParams.page;
                    } else if (data.stat == 'ok') {
                        $this.photos = data.photos;
                    } else {
                        // display error message
                        $this.resetPhotos();
                    }
                    return $this.photos;
                }).catch(function (data) {
                    $this.resetPhotos();
                    return $this.photos;
                });
        }
    };
    
    $this.get = function(photoId) {
        var requestParams = {
            method: "flickr.photos.getInfo",
            photo_id: photoId
        };

        return $this.call(requestParams)
            .then(function(data){
                var photo;
                if (data.stat == 'ok') {
                    var photo = data.photo;
                    photo.url_b = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
                } else {
                    // display error message
                    photo = {};
                }
                return photo;
            }).catch(function (data) {
                return {};
            });
    };
    
    $this.getPrevPhoto = function() {
        var selectedPhotoIndex = $this.getSelectedPhotoIndex();
        if (selectedPhotoIndex > 0)
            return $this.photos.photo[selectedPhotoIndex-1];
        else
            return null;
    };
    
    $this.getNextPhoto = function() {
        var selectedPhotoIndex = $this.getSelectedPhotoIndex();
        if (selectedPhotoIndex >= 0 && selectedPhotoIndex < $this.photos.photo.length - 1)
            return $this.photos.photo[selectedPhotoIndex+1];
        else
            return null;
    };
    
    $this.getSelectedPhotoIndex = function() {
        if ($this.selected)
            return $this.photos.photo.indexOf($this.selected);
        else
            return -1;
    };
    
    $this.setSelected = function(photo) {
        if (photo != undefined)
            $this.selected = photo;

        return $this.selected;
    };
    
    $this.resetPhotos();
        
    return {
        query: $this.query,
        get: $this.get,
        getPrevPhoto: $this.getPrevPhoto,
        getNextPhoto: $this.getNextPhoto,
        photos: function() {
            return $this.photos;
        },
        selected: $this.setSelected,
    };
}])

.controller('SearchCtrl', ['$scope', 'imagesService', '$location', '$routeParams', function ($scope, imagesService, $location, $routeParams) {
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

    $scope.search = function() {
        imagesService.query($scope.query).then(function(data){
            $scope.photos = data;
        });
    };
    
    $scope.$watch("query", function(newValue, oldValue) {
        $scope.search();
    }, true); 
    
    $scope.loadMore = function() {
        $scope.query.page++;
    };
    
    $scope.showPhoto = function(photo) {
        imagesService.selected(photo);
        $location.url('/photo/' + photo.id);
    };
    
    $scope.search();
}]);