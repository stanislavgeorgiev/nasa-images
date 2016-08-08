(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular
            .module('nasaImagesApp')
            .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$rootScope', '$location'];

    function AppCtrl($rootScope, $location) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.pageLoading = false;
        vm.search = search;
        
        vm.q = $location.search().q;

        /////////////////
        
        $rootScope.$on('apiCallBegin', function () {
            vm.pageLoading = true;
        });

        $rootScope.$on('apiCallEnd', function () {
            vm.pageLoading = false;
        });

        $rootScope.$on('apiCallError', function () {
            vm.pageLoading = false;
        });
        
        /////////////////

        function search() {
            $location.url('/?q=' + vm.q);
        };
    }

})();