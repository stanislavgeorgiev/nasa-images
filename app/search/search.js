'use strict';

angular.module('nasaImagesApp.search', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'search/search.html',
        controller: 'SearchCtrl'
    });
}])

.service('imagesService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {
    var $this = this;
    this.photos = null;
    this.lastRequestParams = [];
    this.selected = null;
    
    this.perPage = 48;
    
    this.resetPhotos = function() {
        this.photos = {
            photo: [],
            page: 1,
            pages: 1,
            perpage: this.perPage,
            total: 0
        };
    };
    
    this.call = function(params) {
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
    
    this.getSelectedPhotoIndex = function() {
        if (this.selected)
            return this.photos.photo.indexOf(this.selected);
        else
            return -1;
    };
    
    this.resetPhotos();
        
    return {
        query: function(params) {
            var requestParams = angular.extend({
                method: "flickr.photos.search",
                user_id: "24662369@N07",
                media: "photos",
                text: "",
                tags: "",
                tag_mode: "all",
                sort: "random",
                page: 1,
                per_page: $this.perPage,
                extras: "description,url_b,url_n,o_dims",
            }, params);
            
            if (JSON.stringify(requestParams) === JSON.stringify($this.lastRequestParams) && $this.photos.photo.length > 0) {
                //console.log('load cached');
                var defer = $q.defer();

                $timeout(function () {
                    defer.resolve($this.photos);
                }, 0);

                return defer.promise;
            } else {
                //console.log('load from server');
                $this.lastRequestParams = requestParams;

                return $this.call(requestParams)
                    .then(function(data){
                        if (data.stat == 'ok') {
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
        },
        get: function(photoId) {
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
        },
        getPrevPhoto: function() {
            var selectedPhotoIndex = $this.getSelectedPhotoIndex();
            if (selectedPhotoIndex > 0)
                return $this.photos.photo[selectedPhotoIndex-1];
            else
                return null;
        },
        getNextPhoto: function() {
            var selectedPhotoIndex = $this.getSelectedPhotoIndex();
            if (selectedPhotoIndex >= 0 && selectedPhotoIndex < $this.photos.photo.length - 1)
                return $this.photos.photo[selectedPhotoIndex+1];
            else
                return null;
        },
        photos: function() {
            return $this.photos;
        },
        selected: function(photo) {
            if (photo != undefined)
                $this.selected = photo;
            
            return $this.selected;
        },
    };
}])

.controller('SearchCtrl', ['$scope', 'imagesService', '$location', '$routeParams', function ($scope, imagesService, $location, $routeParams) {
    $scope.photos = [];

    $scope.query = {
        text: $routeParams.q,
    };

    imagesService.query($scope.query).then(function(data){
        $scope.photos = data;
    });
    
    $scope.showPhoto = function(photo) {
        imagesService.selected(photo);
        $location.url('/photo/' + photo.id);
    };
}]);