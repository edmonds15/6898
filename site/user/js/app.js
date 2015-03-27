﻿var incidentUserApp = angular.module('incidentUserApp', [
  'ngMaterial',
  'ngRoute',
  'dataServices',
  'incidentUserControllers'
]);

incidentUserApp.config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {
    $routeProvider.when("/", {
        templateUrl: "partials/newIncident.html",
        controller: "NewIncidentCtrl",
    }).when("/search", {
        templateUrl: "partials/searchIncidents.html",
        controller: "SearchIncidentCtrl",
    }).when("/help", {
        templateUrl: "partials/help.html",
        controller: "HelpCtrl",
    }).otherwise({
        redirectTo: '/'
    });

    $mdThemingProvider.theme('default');
}]);

