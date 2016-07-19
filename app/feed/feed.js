'use strict';

angular.module('nasaImagesApp.feed', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'feed/feed.html',
        controller: 'FeedCtrl'
    });
}])

.service('imagesService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {
    console.log('imagesService construct');
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
    
    this.resetPhotos();
        
    return {
        query: function(params) {
            var requestParams = angular.extend({
                method: "flickr.photos.search",
                user_id: "24662369@N07",
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
        selected: function(photo) {
//            console.log('imagesService.selected, photo', photo);
            if (photo != undefined)
                $this.selected = photo;
//            console.log('imagesService.selected', $this.selected);
            return $this.selected;
        },
    };
}])

.controller('FeedCtrl', ['$scope', 'imagesService', '$location', function ($scope, imagesService, $location) {
    $scope.photos = [];

    imagesService.query().then(function(data){
        $scope.photos = data;
    });
    
    $scope.showPhoto = function(photo) {
        imagesService.selected(photo);
        $location.url('/photo/' + photo.id);
    }
}]);