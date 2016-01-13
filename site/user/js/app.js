var incidentUserApp = angular.module('incidentUserApp', [
  "ngMaterial",
  "ngRoute",
  "ui.bootstrap",
  "incidentUserControllers"
]);

// Configure the different routes and theme
incidentUserApp.config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {
    $routeProvider.when("/", {
        templateUrl: "partials/newIncident.html",
        controller: "NewIncidentCtrl"
    }).when("/update", {
        templateUrl: "partials/updateIncidents.html",
        controller: "UpdateIncidentsCtrl"
    }).when("/search", {
        templateUrl: "partials/searchIncidents.html",
        controller: "SearchIncidentCtrl"
    }).when("/help", {
        templateUrl: "partials/help.html"
    }).otherwise({
        redirectTo: "/"
    });

    $mdThemingProvider.theme("default");
}]);

