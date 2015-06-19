var incidentUserControllers = angular.module('incidentUserControllers', ['dataServices']);

incidentUserControllers.controller("NewIncidentCtrl", ["$scope", "$location", "$window", 'dataSvc', function ($scope, $location, $window, dataSvc) {
    $scope.loadingIncidentRecord = false;
    $scope.notify = [];
    var n = 0;

    dataSvc.getLocations()
        .then(function (response) {
            $scope.locations = response;
        }, function (error) {
            console.log(error);
        });

    dataSvc.getIncidentTypes()
        .then(function (response) {
            $scope.incidents = response;
        }, function (error) {
            console.log(error);
        });

    dataSvc.getIncidentNumber()
        .then(function (response) {
            if (response.count == undefined) {
                n = 1;
            } else {
                n = response.count;
            }
            $scope.num = n;
        }, function (error) {
            console.log(error);
        });
    
    $scope.recordIncident = function (ev) {
        if ($scope.loc == null) {
            alert("Error: Location not set. Please choose a location.");
            return;
        }
        if ($scope.inc == null) {
            alert("Error: Incident type not set. Please choose an incident type.");
            return;
        }
        $scope.loadingIncidentRecord = true;
        var comment = null;
        if ($scope.comment != undefined) {
            comment = $scope.comment;
        }

        dataSvc.recordIncident(n, $scope.loc, $scope.inc, comment)
        .then(function (response) {
            dataSvc.getIncidentNumber()
            .then(function (response) {
                if (response.count == undefined) {
                    n = 1;
                } else {
                    n = response.count;
                }
                $scope.num = n
            }, function (error) {
                console.log(error);
            })
            $scope.loc = null;
            $scope.inc = null;
            $scope.comment = "";
            $scope.prior = [];
            $scope.notify = [];
            $scope.loadingIncidentRecord = false;
            alert("Incident recorded successfully.");
        }, function (error) {
            alert("Error recording incident data, refresh page and try again.");
            $scope.loadingIncidentRecord = false;
            console.log(error);
        });
    }

    $scope.updateNotify = function () {
        dataSvc.getWhoNotify($scope.inc)
            .then(function (response) {
                $scope.notify = response;
            }, function (error) {
                $scope.notify = [];
                console.log(error);
            });
    }

    $scope.updatePrior = function () {
        dataSvc.searchIncidents($scope.loc, null, null, null, null)
            .then(function (response) {
                $scope.prior = response;
            }, function (error) {
                $scope.prior = [];
                console.log(error);
            })
    }
}]);

incidentUserControllers.controller("SearchIncidentCtrl", ["$scope", "$location", "$window", 'dataSvc', function ($scope, $location, $window, dataSvc) {
    $scope.loadingIncidents = false;
    $scope.results = [];
    $scope.results_num = "";
    dataSvc.getLocations()
        .then(function (response) {
            $scope.locations = response;
        }, function (error) {
            console.log(error);
        });

    dataSvc.getIncidentTypes()
        .then(function (response) {
            $scope.incidents = response;
        }, function (error) {
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
        dataSvc.searchIncidents($scope.loc, $scope.inc, $scope.commentContains, after, before)
            .then(function (response) {
                $scope.loadingIncidents = false;
                $scope.results = response;
                $scope.results_num = "Number of Results: " + $scope.results.length;
            }, function (error) {
                $scope.results_num = "";
                $scope.results = [];
                $scope.loadingIncidents = false;
                console.log(error);
            });
    };
}]);

incidentUserControllers.controller("HelpCtrl", ["$scope", "$location", "$window", 'dataSvc', function ($scope, $location, $window, dataSvc) {

}]);