var incidentUserControllers = angular.module("incidentUserControllers", ["dataServices"]);
// The alert message that appears when a database request fails
var dangerMessage = "FATAL: database failed. Refresh and try again, or contact.";

// Controller for the "New Incident" page
incidentUserControllers.controller("NewIncidentCtrl",
        ["$scope", "$timeout", "dataSvc", function ($scope, $timeout, dataSvc) {
    $scope.loadingIncidentRecord = false;
    $scope.notify = [];
    $scope.prior = [];
    $scope.dangerAlerts = [];
    $scope.warningAlerts = [];
    $scope.goodAlerts = [];
    var n = 0;

    // Pull all locations and put them in location dropdown
    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({ msg: dangerMessage });
    });

    // Pull all incident types and put them in incident dropdown
    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({msg: dangerMessage });
    });

    // Get next incident number, and save it
    dataSvc.getIncidentNumber().then(function (response) {
        // Set it to 1 if there are no incidents
        if (response.count == undefined) {
            n = 1;
        } else {
            n = response.count;
        }
        $scope.num = n;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({ msg: dangerMessage });
    });
    
    // Validate input, then record incident and notify Regroup
    $scope.recordIncident = function (ev) {
        $scope.warningAlerts = [];
        // Check if location is filled
        if ($scope.loc == null) {
            $scope.warningAlerts.push({ msg: "Please select the incident location." });
            if ($scope.inc == null) {
                $scope.warningAlerts.push({ msg: "Please select the incident type." });
            }
            return;
        }
        // Check if incident is filled
        else if ($scope.inc == null) {
            $scope.warningAlerts.push({ msg: "Please select the incident type." });
            return;
        }
        $scope.loadingIncidentRecord = true;
        // Set comment to null if blank
        var comment = null;
        if ($scope.comment != undefined) {
            comment = $scope.comment;
        }

        // Send data to be recorded
        dataSvc.recordIncident(n, $scope.loc, $scope.inc, comment).then(function (response) {
            console.log(response);
            var recordAlert = { msg: "incident recorded successfully " };
            $scope.goodAlerts.push(recordAlert);
            $timeout(function () {
                $scope.goodAlerts.splice($scope.goodAlerts.indexOf(recordAlert), 1);
            }, 5000);
            // Update incident number
            dataSvc.getIncidentNumber().then(function (response) {
                if (response.count == undefined) {
                    n = 1;
                } else {
                    n = response.count;
                }
                $scope.num = n;
            }, function (error) {
                console.log(error);
                $scope.dangerAlerts.push({ msg: dangerMessage });
            });
            $scope.loc = null;
            $scope.inc = null;
            $scope.comment = "";
            $scope.prior = [];
            $scope.notify = [];
            $scope.loadingIncidentRecord = false;
            // Notify Regroup
            var regroupAlert = dataSvc.regroupNotify();
            //TODO push to different alert arrays based on response
            $scope.goodAlerts.push(regroupAlert);
            $timeout(function () {
                $scope.goodAlerts.splice($scope.goodAlerts.indexOf(regroupAlert), 1);
            }, 5200);
        }, function (error) {
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
            $scope.loc = null;
            $scope.inc = null;
            $scope.comment = "";
            $scope.prior = [];
            $scope.notify = [];
            $scope.loadingIncidentRecord = false;
        });
    }

    // Pull the notification list for the selected incident and display it
    $scope.updateNotify = function () {
        dataSvc.getWhoNotify($scope.inc).then(function (response) {
            $scope.notify = response;
        }, function (error) {
            $scope.notify = [];
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

    // Pull the prior incidents for the selected location and display it
    $scope.updatePrior = function () {
        dataSvc.searchIncidents($scope.loc, null, null, null, null).then(function (response) {
            $scope.prior = response;
        }, function (error) {
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

    // Close the selected yellow alert
    $scope.closeBadAlert = function (index) {
        $scope.warningAlerts.splice(index, 1);
    }

    // Close the selected green alert
    $scope.closeGoodAlert = function (index) {
        $scope.goodAlerts.splice(index, 1);
    }
}]);

// Controller for the "Search Incidents" page
incidentUserControllers.controller("SearchIncidentCtrl",
        ["$scope", "dataSvc", function ($scope, dataSvc) {
    $scope.loadingIncidents = false;
    $scope.alerts = [];
    $scope.results = [];
    $scope.results_num = "";

    // Pull all locations and put them in location dropdown
    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        console.log(error);
        $scope.alerts.push({ msg: dangerMessage });
    });

    // Pull all incident types and put them in incident dropdown
    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        console.log(error);
        $scope.alerts.push({ msg: dangerMessage });
    });

    // Wipe all fields and previous results
    $scope.clearFields = function (ev) {
        $scope.loc = null;
        $scope.inc = null;
        $scope.commentContains = null;
        $scope.date_after = null;
        $scope.date_before = null;
        $scope.results_num = "";
        $scope.results = [];
    }

    // Pull incidents matching search params, and display
    $scope.searchIncidents = function (ev) {
        $scope.loadingIncidents = true;

        // Use date params 1980-2500 if not given
        var after = "01/01/1980";
        if ($scope.date_after) {
            after = $scope.date_after.toLocaleDateString();
        }
        var before = "01/01/2500";
        if ($scope.date_before) {
            before = $scope.date_before.toLocaleDateString();
        }

        // Send info to pull incidents
        dataSvc.searchIncidents($scope.loc, $scope.inc, $scope.commentContains,
                after, before).then(function (response) {
            $scope.loadingIncidents = false;
            $scope.results = response;
            $scope.results_num = "Number of Results: " + $scope.results.length;
        }, function (error) {
            console.log(error);
            $scope.results_num = "";
            $scope.results = [];
            $scope.loadingIncidents = false;
            $scope.alerts.push({ msg: dangerMessage });
        });
    }
}]);