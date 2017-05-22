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
    $scope.search = function(search) {
        console.log(search)
    }

});

app.controller('ErrorCtrl', function( /* $scope, $location, $http */ ) {

});
