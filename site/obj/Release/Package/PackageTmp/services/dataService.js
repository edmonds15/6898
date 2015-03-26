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

    function getIncidentTypes() {
        var deferred = $q.defer();
        $http.get("/api/getIncidentTypes.aspx")
            .then(function (result) {
                var incidents = result.data;
                deferred.resolve(incidents);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function getIncidentNumber() {
        var deferred = $q.defer();
        $http.get("/api/getIncidentNumber.aspx")
            .then(function (result) {
                var number = result.data;
                deferred.resolve(number);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function recordIncident(location, incident, comment) {
        var deferred = $q.defer();
        $http.get("/api/recordIncident.aspx?location=" + location + "&incident=" + incident + "&comment=" + comment)
            .success(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function searchIncidents(location, incident, comment, before, after) {
        var deferred = $q.defer();
        $http.get("/api/searchIncidents.aspx?location=" + location + "&incident=" + incident + "&comment=" + comment + "&before=" + before + "&after=" + after)
            .success(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    return {
        getLocations: getLocations,
        getIncidentTypes: getIncidentTypes,
        getIncidentNumber: getIncidentNumber,
        recordIncident: recordIncident,
        searchIncidents: searchIncidents
    };
}]);