var incidentViewOnlyApp = angular.module("incidentViewOnlyApp", [
  "incidentViewOnlyControllers",
  "ui.bootstrap",
  "ngMaterial"
]);

var incidentViewOnlyControllers = angular.module("incidentViewOnlyControllers", ["dataServices"]);

incidentViewOnlyControllers.controller("SearchCtrl", ["$scope", "$location", "$window", "dataSvc", function ($scope, $location, $window, dataSvc) {
    $scope.loadingIncidents = false;
    $scope.alerts = [];
    $scope.results = [];
    $scope.results_num = "";
    dataSvc.getLocations()
        .then(function (response) {
            $scope.locations = response;
        }, function (error) {
            $scope.alerts.push({ msg: "Uh-oh. Something went wrong with our location database. Refresh the page to try again. If the problem persists, contact" });
            console.log(error);
        });

    dataSvc.getIncidentTypes()
        .then(function (response) {
            $scope.incidents = response;
        }, function (error) {
            $scope.alerts.push({ msg: "Uh-oh. Something went wrong with our incident type database. Refresh the page to try again. If the problem persists, contact" });
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
                $scope.alerts.push({ msg: "Uh-oh. Something went wrong with our database. Refresh the page to try again. If the problem persists, contact" });
                console.log(error);
            });
    };
}]);