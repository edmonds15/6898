var incidentAdminApp = angular.module("incidentAdminApp", [
  "ngMaterial",
  "ngRoute",
  "ui.bootstrap",
  "incidentAdminControllers"
]);

// Configure the different routes and theme
incidentAdminApp.config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {
    $routeProvider.when("/", {
        templateUrl: "partials/home.html",
    }).when("/help", {
        templateUrl: "partials/help.html",
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
        redirectTo: "/"
    });

    $mdThemingProvider.theme("default");
}]);