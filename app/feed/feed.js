'use strict';

angular.module('nasaImagesApp.feed', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'feed/feed.html',
        controller: 'FeedCtrl'
    });
}])

.factory('imagesFactory', ['$http', function ($http) {
    return {
        get: function(params) {
            var requestParams = angular.extend({
                id: "24662369@N07",
                api_key: "0e2b6aaf8a6901c264acb91f151a3350",
                nojsoncallback: 1,
                method: "flickr.photos.search",
                format: "json",
                sort: "random",
                tags: "",
                tag_mode: "all"
            }, params);
            
            console.log('requestParams', requestParams);
            return $http.get('https://api.flickr.com/services/rest/', {params: requestParams})
                .then(function(data){
                    var photos = data.data.photos;
                    photos.photo.forEach(function(photo) {
                        var imagePath = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret;
                        angular.extend(photo, {
                            thumb: imagePath + "_m.jpg",
                            medium: imagePath + ".jpg",
                            large: imagePath + "_b.jpg"
                        });
                    });
                    console.log("data", data.data);
                    console.log("photos", photos);
                    return photos;
                }).catch(function (data) {
                    return [];
                });
        }
    };
}])

.controller('FeedCtrl', ['$scope', 'imagesFactory', function ($scope, imagesFactory) {
    $scope.photos = [];

    imagesFactory.get({
        tags: 'Mars'
    }).then(function(data){
        $scope.photos = data;
    }); 
}]);