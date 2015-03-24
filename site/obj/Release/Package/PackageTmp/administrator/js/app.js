var incidentAdminApp = angular.module('incidentAdminApp', [
  'ngMaterial',
  'ngRoute',
  'incidentAdminServices',
  'incidentAdminControllers'
]);

incidentAdminApp.config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {
    $routeProvider.when("/", {
        templateUrl: "partials/home.html",
        controller: "HomeCtrl",
    }).when("/help", {
        templateUrl: "partials/help.html",
        controller: "HelpCtrl",
    }).otherwise({
        redirectTo: '/'
    });

    $mdThemingProvider.theme('default');
}]);