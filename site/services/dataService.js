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

    function recordIncident(number, location, incident, comment) {
        var deferred = $q.defer();
        var url = "../api/recordIncident.aspx?number=" + number + "&location=" + location + "&incident=" + incident;
        if (comment != undefined) {
            url += "&comment=" + comment;
        }
        $http.get(url)
            .success(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function deleteIncident(id) {
        var deferred = $q.defer();
        $http.get("../api/deleteIncident.aspx?id=" + id)
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
            url += "before=" + before;
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

    function deleteUser(id) {
        var deferred = $q.defer();
        $http.get("../api/deleteUser.aspx?id=" + id)
            .then(function (result) {
                var users = result.data;
                deferred.resolve(users);
            }, function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function addUser(username, role) {
        var deferred = $q.defer();
        $http.get("../api/addUser.aspx?username=" + username + "&role=" + role)
            .then(function (result) {
                deferred.resolve(result.data);
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

    function editIncident(id, num, time, creator, loc, inc, comment) {
        var deferred = $q.defer();
        var url = "../api/editIncident.aspx?id=" + id + "&num=" + num + "&time=" + time + "&creator=" + creator + "&loc=" + loc + "&inc=" + inc;
        if (comment != undefined) {
            url += "&comment=" + comment;
        }
        $http.get(url)
            .then(function (result) {
                deferred.resolve(result.data);
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
        deleteIncident: deleteIncident,
        searchIncidents: searchIncidents,
        getUsers: getUsers,
        addUser: addUser,
        deleteUser: deleteUser,
        getIncidents: getIncidents,
        editIncident: editIncident,
        getWhoNotify: getWhoNotify
    };
}]);