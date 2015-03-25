var incidentUserApp = angular.module('incidentUserApp', [
  'ngMaterial',
  'dataServices'
]);

incidentUserApp.controller("UserCtrl", ["$scope", "dataSvc", function ($scope, dataSvc) {
    $scope.test = "Hello World!";
    $scope.loc = dataSvc.getLocations();
}]);