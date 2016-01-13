var dataServices = angular.module("dataServices", ["ngResource"]);

dataServices.factory("dataSvc", ["$http", "$q", function ($http, $q) {

    // Gets the location names
    function getLocations() {
        var deferred = $q.defer();
        // Send request
        $http.get("../api/getLocations.aspx").then(function (result) {
            var locations = result.data;
            // Check if response is valid
            if (angular.isObject(locations)) {
                deferred.resolve(locations);
            } else {
                deferred.reject(locations);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Gets the types of incidents
    function getIncidentTypes() {
        var deferred = $q.defer();
        // Send request
        $http.get("../api/getIncidentTypes.aspx").then(function (result) {
            var incidents = result.data;
            // Check if response is valid
            if (angular.isObject(incidents)) {
                deferred.resolve(incidents);
            } else {
                deferred.reject(incidents);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Gets the next incident number to use
    function getIncidentNumber() {
        var deferred = $q.defer();
        // Send request
        $http.get("../api/getIncidentNumber.aspx").then(function (result) {
            var number = result.data;
            // Check if response is valid
            if (angular.isObject(number)) {
                deferred.resolve(number);
            } else {
                deferred.reject(number);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Records the incident with the given info
    function recordIncident(number, location, incident, comment) {
        var deferred = $q.defer();
        // Send info
        var url = "../api/recordIncident.aspx?number=" + number + "&location=" + location + "&incident=" + incident;
        if (comment != undefined) {
            url += "&comment=" + comment;
        }
        $http.get(url).then(function (result) {
            var data = result.data;
            // Make sure add was successful
            if (data.charAt(0) == "1") {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Notifies Regroup of the given incident
    function regroupNotify(location, incident, comment) {
        var deferred = $q.defer();
        var url = "../api/getRegroupInfo.aspx?location=" + location + "&incident=" + incident;
        $http.get(url).then(function (result) {
            var data = result.data;
            if (angular.isObject(data)) {
                // If Regroup API changes, make changes here.
                var xmlMsg = "<?xml version=\"1.0\"?><topic>";

                // Chris testing
                //var commentMsg = comment + " -- " + data.incidentType + " - " + data.locationName;            // Chris added this line 20150925 ... use this if want to show incident & location
                var commentMsg = comment + " -- " + data.locationName;                                          // This just shows Location
                // end Chris testing

                xmlMsg += "<subject>" + data.incidentType + " at " + data.locationName + "</subject>";
                //xmlMsg += "<body><![CDATA[Description: " + comment + "]]></body>";                          // Chris added comment 20150925
                xmlMsg += "<body><![CDATA[" + commentMsg + "]]></body>";                         // Chris added this line 20150925
                xmlMsg += "<mail>1</mail><sms>1</sms>";
                xmlMsg += "<group_id>" + data.groupId + "</group_id></topic>";
                $http.post("https://regroup.com/api/v1/topics?api_key=1a20bc69ff1d932d972b27d760a1a2fe", xmlMsg, { headers: { "Content-Type": "application/xml" } });
                deferred.resolve({ msg: "Regroup notified." });
            } else {
                deferred.reject({ msg: "Regroup not notified." });
            }
        }, function () {
            deferred.reject({ msg: "Regroup not notified." });
        });
        return deferred.promise;
    }

    function getIncidents() {
        var deferred = $q.defer();
        $http.get("../api/getIncidents.aspx").then(function (result) {
            var data = result.data;
            if (angular.isObject(data)) {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getIncidentInfo(id) {
        var deferred = $q.defer();
        $http.get("../api/getIncidentInfo.aspx?id=" + id).then(function (result) {
            var data = result.data;
            if (angular.isObject(data)) {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function updateIncident(id, update) {
        var deferred = $q.defer();
        var url = "../api/updateIncident.aspx?id=" + id + "&update=" + update;
        $http.get(url).then(function (result) {
            var data = result.data;
            if (data.charAt(0) == "1") {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Deletes the incident with the given id
    function deleteIncident(id) {
        var deferred = $q.defer();
        // Send info
        $http.get("../api/deleteIncident.aspx?id=" + id).then(function (result) {
            var data = result.data;
            // Make sure delete was successful
            if (data.charAt(0) == "1") {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Gets all incidents matching given search params
    function searchIncidents(location, incident, comment, after, before) {
        var deferred = $q.defer();
        // Add params to request if they exist
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
        // Send request
        $http.get(url).then(function (result) {
            var data = result.data;
            // Make sure response is valid
            if (angular.isObject(data)) {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Gets all users
    function getUsers() {
        var deferred = $q.defer();
        // Send request
        $http.get("../api/getUsers.aspx").then(function (result) {

            var users = result.data;
            // Make sure response is valid
            if (angular.isObject(users)) {
                deferred.resolve(users);
            } else {
                deferred.reject(users);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Deletes the user with the specified id
    function deleteUser(id) {
        var deferred = $q.defer();
        // Send info
        $http.get("../api/deleteUser.aspx?id=" + id).then(function (result) {
            var data = result.data;
            // Make sure delete was successful
            if (data.charAt(0) == "1") {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Adds the user with the given info
    function addUser(username, role) {
        var deferred = $q.defer();
        // Send info
        $http.get("../api/addUser.aspx?username=" + username + "&role=" + role).then(function (result) {
            var data = result.data;
            // Make sure add was successful
            if (data.charAt(0) == "1") {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Edits the incident with the given id using the given info
    function editIncident(id, num, time, creator, loc, inc, comment) {
        var deferred = $q.defer();
        var url = "../api/editIncident.aspx?id=" + id + "&num=" + num + "&time=" + time + "&creator=" + creator + "&loc=" + loc + "&inc=" + inc;
        if (comment != undefined) {
            url += "&comment=" + comment;
        }
        // Send info
        $http.get(url).then(function (result) {
            var data = result.data;
            // Make sure both delete and add were successful
            var split = data.split("\r\n");
            if (split[0].charAt(0) == "1") {
                if (split[1].charAt(0) == "1") {
                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            } else {
                deferred.reject(data);
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Gets who to notify for the given incident
    function getWhoNotify(incident) {
        var deferred = $q.defer();
        // Send request
        $http.get("../api/getWhoNotify.aspx?incident=" + incident).then(function (result) {
            var data = result.data;
            // Make sure response is valid
            if (angular.isObject(data)) {
                deferred.resolve(data);
            } else {
                deferred.reject(data);
            }
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
        regroupNotify: regroupNotify,
        getIncidents: getIncidents,
        getIncidentInfo: getIncidentInfo,
        updateIncident: updateIncident,
        deleteIncident: deleteIncident,
        searchIncidents: searchIncidents,
        getUsers: getUsers,
        addUser: addUser,
        deleteUser: deleteUser,
        editIncident: editIncident,
        getWhoNotify: getWhoNotify
    };
}]);