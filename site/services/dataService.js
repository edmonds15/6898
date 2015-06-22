var dataServices = angular.module('dataServices', ['ngResource', 'ngCookies']);

dataServices.factory('dataSvc', ["$http", "$q", "$cookies", function ($http, $q, $cookies) {

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

    function regroupNotify() {

        var fd = new FormData();
        fd.append("utf8", "\u2713");
        fd.append("authenticity_token", "wslBMR7mYqzyxEd8+rcCkLO3EfLifoO0iE4cPKnc71E=");
        fd.append("post_type[]", "web_email");
        fd.append("smpp_alert", "smpp_alert");
        fd.append("topic[publish_to_facebook]", "0");
        fd.append("topic[started_by_id]", "13437781");
        fd.append("topic[most_recent_editor_id]", "13437781");
        fd.append("admin_group_id", "244429");
        fd.append("map_info[polygon]", "");
        fd.append("region[title]", "");
        fd.append("topic[map_removed_users]", "");
        fd.append("user_network_fb_connected", "false");
        fd.append("post_group_ids", "244429");
        fd.append("users_file", "");
        fd.append("topic[cc_emails]", "");
        fd.append("topic_from", "group");
        fd.append("topic[reply_to]", "custom");
        fd.append("topic[reply_to_text]", "phippenj@edmonds.wednet.edu");
        fd.append("topic[designation][]", "1");
        fd.append("topic[designation][]", "2");
        fd.append("topic[designation][]", "3");
        fd.append("topic[designation][]", "4");
        fd.append("caller_id", "14257739376");
        fd.append("topic[template_id]", "");
        fd.append("topic[region_id]", "");
        fd.append("topic[subject]", "Testing");
        fd.append("topic[topic_files][0]", "");
        fd.append("topic[body]", "<p>Testing...</p>");
        fd.append("message", "Testing...");
        fd.append("topic[save_template]", "");
        fd.append("topic[edit_template]", "");
        fd.append("topic[network_id]", "10356");
        fd.append("send_test_msg", "true");
        fd.append("date", "");
        fd.append("hour", "1");
        fd.append("minute", "0");
        fd.append("meridian", "am");
        fd.append("tzone", "CDT");
        fd.append("frequency", "none");

        return $http({
            method: "POST",
            url: "https://edmonds.regroup.com/topics/create",
            headers: {
                "Content-Type": undefined
            },
            data: fd,
            xsrfCookieName: "myCookie",
            transformRequest: function (data) { return data; }
        });
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
        regroupNotify: regroupNotify,
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