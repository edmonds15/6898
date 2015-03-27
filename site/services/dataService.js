var dataServices = angular.module('dataServices', ['ngResource']);

dataServices.factory('dataSvc', ["$http", "$q", function ($http, $q) {

    function getLocations() {
        var deferred = $q.defer();
        $http.get("../api/getLocations.aspx")
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
        $http.get("../api/getIncidentTypes.aspx")
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
        $http.get("../api/getIncidentNumber.aspx")
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
        $http.get("../api/recordIncident.aspx?location=" + location + "&incident=" + incident + "&comment=" + comment)
            .success(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function searchIncidents(location, incident, comment, after, before) {
        var deferred = $q.defer();
        var url = "../api/searchIncidents.aspx?";
        if (location != null && location != "" && location != undefined && location != "undefined") {
            url += "location=" + location + "&";
        }
        if (incident != null && incident != "" && incident != undefined && incident != "undefined") {
            url += "incident=" + incident + "&";
        }
        if (comment != null && comment != "" && comment != undefined && comment != "undefined") {
            url += "comment=" + comment + "&";
        }
        if (after != null && after != "" && after != undefined && after != "undefined") {
            url += "after=" + after + "&";
        }
        if (before != null && before != "" && before != undefined && before != "undefined") {
            url += "before=" + before + "&";
        }
        $http.get(url)
            .success(function (result) {
                deferred.resolve(result);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function getUsers() {
        var deferred = $q.defer();
        $http.get("../api/getUsers.aspx")
            .then(function (result) {
                var users = result.data;
                deferred.resolve(users);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function getIncidents() {
        var deferred = $q.defer();
        $http.get("../api/getIncidents.aspx")
            .then(function (result) {
                var incidents = result.data;
                deferred.resolve(incidents);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function getWhoNotify(incident) {
        var deferred = $q.defer();
        $http.get("../api/getWhoNotify.aspx?incident=" + incident)
            .then(function (result) {
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
        searchIncidents: searchIncidents,
        getUsers: getUsers,
        getIncidents: getIncidents,
        getWhoNotify: getWhoNotify
    };
}]);