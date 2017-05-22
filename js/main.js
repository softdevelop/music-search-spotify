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
    var cookie = localStorage.getItem('keyword');
    var search_limit = 8;
    $scope.search_type = ['album', 'artist'];
    $scope.search_types = ['albums', 'artists'];
    $scope.search_model = cookie ? cookie : '';
    $scope.search_result_albums = [];
    $scope.search_result_artists = [];
    $scope.search_offset_albums = 0;
    $scope.search_offset_artists = 0;
    $scope.albums_next = null;
    $scope.artists_next = null;
    $scope.albums_page = 1;
    $scope.artists_page = 1;
    $scope.albums_show_more = false;
    $scope.artists_show_more = false;
    $scope.active_tab = true;
    $scope.disable_search_button = false;
    $scope.data = {};

    if(cookie){
        $scope.disable_search_button = true;
        f_search($scope.search_model, 0, $scope.search_type, 1);
    }

    $scope.search = function(key, offset, search_type) {
        $scope.disable_search_button = true;
        $scope.search_result_albums = [];
        $scope.search_result_artists = [];
        $scope.search_offset_albums = 0;
        $scope.search_offset_artists = 0;
        $scope.albums_next = null;
        $scope.artists_next = null;
        $scope.search_model = key;
        f_search(key, offset, search_type, 1);
    }

    $scope.showMove = function(key, offset, search_type, page) {
        $scope.search_model = key;
        f_search(key, offset, search_type, page);
    }

    function f_search(key, offset, search_type, page) {
        search_type = search_type.toString();
        localStorage.setItem('keyword', key);
        var search_url = 'https://api.spotify.com/v1/search?q=' + key + '&type=' + search_type + '&limit=' + search_limit + '&offset=' + offset;
        $http.get(search_url).then(function(response) {
            $scope.disable_search_button =  false;
            var data = response.data;
            var albums_arr = data.albums ? data.albums.items : [];
            $scope.albums_next = data.albums ? data.albums.next : null;
            $scope.search_result_albums = $scope.search_result_albums.concat(albums_arr);
            $scope.search_offset_albums = $scope.albums_next ? ($scope.search_offset_albums + data.albums.limit) : $scope.search_offset_albums;
            $scope.albums_page = $scope.albums_next ? $scope.albums_page + 1 : $scope.albums_page;
            if(page !== $scope.albums_page){
                $scope.albums_show_more = true;
            }
            
            var artists_arr = data.artists ? data.artists.items : [];
            $scope.artists_next = data.artists ? data.artists.next : null;
            $scope.search_result_artists = $scope.search_result_artists.concat(artists_arr);
            $scope.search_offset_artists = $scope.artists_next ? ($scope.search_offset_artists + data.artists.limit) : $scope.search_offset_artists;
            $scope.artists_page = $scope.artists_next ? $scope.artists_page + 1 : $scope.artists_page;
            $scope.artists_show_more = false;
            if(page !== $scope.artists_page){
                $scope.artists_show_more = true;
            }
        });
    }

    // modal
    $scope.modalShown = false;
    $scope.detail = {};
    $scope.toggleModal = function(type, id) {
        $scope.modalShown = !$scope.modalShown;
        var detail_url = 'https://api.spotify.com/v1/'+ type + '/' + id;
        $http.get(detail_url).then(function(response) {
            var data = response.data;
            $scope.detail = data;
        });

        var limit_track = 20;
        if(type === $scope.search_types[0]){
            var track_url = 'https://api.spotify.com/v1/albums/' + id + '/tracks?limit=' + limit_track;
        }else if(type === $scope.search_types[1]){
            var track_url = 'https://api.spotify.com/v1/artists/' + id + '/albums?album_type=single&limit=' + limit_track;
        }

        $scope.detail_track = [];
        $http.get(track_url).then(function(response) {
            var data = response.data;
            $scope.detail_track = data;
            console.log($scope.detail_track)
        });

    };
});

app.controller('ErrorCtrl', function( /* $scope, $location, $http */ ) {

});
