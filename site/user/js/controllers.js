var incidentUserControllers = angular.module('incidentUserControllers', ['dataServices']);

incidentUserControllers.controller("NewIncidentCtrl", ["$scope", "$location", "$window", 'dataSvc', function ($scope, $location, $window, dataSvc) {
    date = new Date(); 
    $scope.currentTime = date.toLocaleString();
    $scope.loadingIncidentRecord = false;
    $scope.notify = [];

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
            $scope.incidentNumber = "Incident Number: " + response.count;
        }, function (error) {
            console.log(error);
        });

    $scope.recordIncident = function (ev) {
        $scope.loadingIncidentRecord = true;

        dataSvc.recordIncident($scope.loc, $scope.inc, $scope.comment)
        .then(function (response) {
            dataSvc.getIncidentNumber()
            .then(function (response) {
                $scope.incidentNumber = "Incident Number: " + response.count;
            }, function (error) {
                console.log(error);
            })
            $scope.loc = null;
            $scope.inc = null;
            $scope.comment = "";
            $scope.loadingIncidentRecord = false;
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