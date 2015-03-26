var incidentUserControllers = angular.module('incidentUserControllers', ['dataServices']);

incidentUserControllers.controller("NewIncidentCtrl", ["$scope", "$location", "$window", 'dataSvc', function ($scope, $location, $window, dataSvc) {
    date = new Date(); 
    $scope.currentTime = date.toLocaleString();
    $scope.loadingIncidentRecord = false;

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
        })

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
}]);

incidentUserControllers.controller("SearchIncidentCtrl", ["$scope", "$location", "$window", 'dataSvc', function ($scope, $location, $window, dataSvc) {
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

    $scope.searchIncidents = function (ev) {
        dataSvc.searchIncidents($scope.loc, $scope.inc, $scope.comment, $scope.date_after, $scope.date_before)
            .then(function (response) {
            $scope.searchResults = response;
            }, function (error) {
                console.log(error);
            });
    };
}]);
