var dataServices = angular.module('dataServices', ['ngResource']);

dataServices.factory('dataSvc', ["$http", "$q", function ($http, $q) {

    function getLocations() {
        var deferred = $q.defer();
        $http.get("/api/getLocations.aspx")
            .then(function (result) {
                var locations = result.data;
                deferred.resolve(locations);
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    return {
        getLocations: getLocations
    };
}]);