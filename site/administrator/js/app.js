var incidentAdminApp = angular.module("incidentAdminApp", [
  "ngMaterial",
  "ngRoute",
  "ngCookies",
  "incidentAdminControllers",
  "ui.bootstrap"
]);

incidentAdminApp.config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {
    $routeProvider.when("/", {
        templateUrl: "partials/home.html",
        controller: "HomeCtrl",
    }).when("/help", {
        templateUrl: "partials/help.html",
        controller: "HelpCtrl",
    }).when("/users", {
        templateUrl: "partials/changeUsers.html",
        controller: "UsersCtrl",
    }).when("/incidents", {
        templateUrl: "partials/changeIncidents.html",
        controller: "IncidentsCtrl",
    }).when("/editContact", {
        templateUrl: "partials/editContacts.html",
        controller: "EditContactsCtrl",
    }).otherwise({
        redirectTo: '/'
    });

    $mdThemingProvider.theme("default");
}]);