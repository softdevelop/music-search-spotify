var app = angular.module('App', [
    'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        // Home
        .when("/", { templateUrl: "partials/home.html", controller: "HomeCtrl" })
        // else 404
        .otherwise("/404", { templateUrl: "partials/404.html", controller: "ErrorCtrl" });
}]);

app.controller('HomeCtrl', function( $scope, $location, $http) {
    var search_type = 'album,artist';
    var search_limit = 6;
    $scope.search_result = [];
    $scope.search = function(key) {
        console.log('search')
        console.log(key)
        var search_url = 'https://api.spotify.com/v1/search?q=' + key + '&type=' + search_type + '&limit=' + search_limit
        $http.get(search_url).then(function(response) {
            console.log(response.data);
        });
    }

    // modal
    $scope.modalShown = false;
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };

});

app.controller('ErrorCtrl', function( /* $scope, $location, $http */ ) {

});
