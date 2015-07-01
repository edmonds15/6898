var incidentUserControllers = angular.module("incidentUserControllers", ["dataServices"]);
var dangerMessage = "FATAL: database failed. Refresh and try again, or contact.";

incidentUserControllers.controller("NewIncidentCtrl",
        ["$scope", "$timeout", "dataSvc", function ($scope, $timeout, dataSvc) {
    $scope.loadingIncidentRecord = false;
    $scope.notify = [];
    $scope.prior = [];
    $scope.dangerAlerts = [];
    $scope.warningAlerts = [];
    $scope.goodAlerts = [];
    var n = 0;

    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        $scope.dangerAlerts.push({ msg: dangerMessage });
        console.log(error);
    });

    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        $scope.dangerAlerts.push({msg: dangerMessage });
        console.log(error);
    });

    dataSvc.getIncidentNumber().then(function (response) {
        if (response.count == undefined) {
            n = 1;
        } else {
            n = response.count;
        }
        $scope.num = n;
    }, function (error) {
        $scope.dangerAlerts.push({ msg: dangerMessage });
        console.log(error);
    });
    
    $scope.recordIncident = function (ev) {
        $scope.warningAlerts = [];
        if ($scope.loc == null) {
            $scope.warningAlerts.push({ msg: "Please select the incident location." });
            if ($scope.inc == null) {
                $scope.warningAlerts.push({ msg: "Please select the incident type." });
            }
            return;
        }
        else if ($scope.inc == null) {
            $scope.warningAlerts.push({ msg: "Please select the incident type." });
            return;
        }
        $scope.loadingIncidentRecord = true;
        var comment = null;
        if ($scope.comment != undefined) {
            comment = $scope.comment;
        }

        dataSvc.recordIncident(n, $scope.loc, $scope.inc, comment).then(function (response) {
            console.log(response);
            var recordAlert = { msg: "incident recorded successfully " };
            $scope.goodAlerts.push(recordAlert);
            $timeout(function () {
                $scope.goodAlerts.splice($scope.goodAlerts.indexOf(recordAlert), 1);
            }, 5000);
            dataSvc.getIncidentNumber().then(function (response) {
                if (response.count == undefined) {
                    n = 1;
                } else {
                    n = response.count;
                }
                $scope.num = n;
            }, function (error) {
                $scope.dangerAlerts.push({ msg: dangerMessage });
                console.log(error);
            });
            $scope.loc = null;
            $scope.inc = null;
            $scope.comment = "";
            $scope.prior = [];
            $scope.notify = [];
            $scope.loadingIncidentRecord = false;
            var regroupAlert = dataSvc.regroupNotify();
            //TODO push to different alert arrays based on response
            $scope.goodAlerts.push(regroupAlert);
            $timeout(function () {
                $scope.goodAlerts.splice($scope.goodAlerts.indexOf(regroupAlert), 1);
            }, 5200);
        }, function (error) {
            $scope.dangerAlerts.push({ msg: dangerMessage });
            $scope.loadingIncidentRecord = false;
            console.log(error);
        });
    }

    $scope.updateNotify = function () {
        dataSvc.getWhoNotify($scope.inc).then(function (response) {
            $scope.notify = response;
        }, function (error) {
            $scope.notify = [];
            $scope.dangerAlerts.push({ msg: dangerMessage });
            console.log(error);
        });
    }

    $scope.updatePrior = function () {
        dataSvc.searchIncidents($scope.loc, null, null, null, null).then(function (response) {
            $scope.prior = response;
        }, function (error) {
            $scope.prior = [];
            $scope.dangerAlerts.push({ msg: dangerMessage });
            console.log(error);
        });
    }

    $scope.closeBadAlert = function (index) {
        $scope.warningAlerts.splice(index, 1);
    }

    $scope.closeGoodAlert = function (index) {
        $scope.goodAlerts.splice(index, 1);
    }
}]);

incidentUserControllers.controller("SearchIncidentCtrl",
        ["$scope", "dataSvc", function ($scope, dataSvc) {
    $scope.loadingIncidents = false;
    $scope.alerts = [];
    $scope.results = [];
    $scope.results_num = "";
    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        $scope.alerts.push({ msg: dangerMessage });
        console.log(error);
    });

    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        $scope.alerts.push({ msg: dangerMessage });
        console.log(error);
    });

    $scope.clearFields = function (ev) {
        $scope.loc = null;
        $scope.inc = null;
        $scope.commentContains = null;
        $scope.date_after = null;
        $scope.date_before = null;
        $scope.results_num = "";
        $scope.results = [];
    }

    $scope.searchIncidents = function (ev) {
        $scope.loadingIncidents = true;

        var after = "01/01/1980";
        if ($scope.date_after) {
            after = $scope.date_after.toLocaleDateString();
        }
        var before = "01/01/2500";
        if ($scope.date_before) {
            before = $scope.date_before.toLocaleDateString();
        }

        dataSvc.searchIncidents($scope.loc, $scope.inc, $scope.commentContains,
                after, before).then(function (response) {
            $scope.loadingIncidents = false;
            $scope.results = response;
            $scope.results_num = "Number of Results: " + $scope.results.length;
        }, function (error) {
            $scope.results_num = "";
            $scope.results = [];
            $scope.loadingIncidents = false;
            $scope.alerts.push({ msg: dangerMessage });
            console.log(error);
        });
    }
}]);