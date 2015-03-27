var incidentAdminControllers = angular.module('incidentAdminControllers', ['dataServices']);

incidentAdminControllers.controller("HomeCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {
    $scope.clicked = false;

    $scope.toUserPage = function (ev) {
        $scope.clicked = true;
    }
}]);

incidentAdminControllers.controller("HelpCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

}]);

incidentAdminControllers.controller("UsersCtrl", ["$scope", "$location", "$window", "dataSvc", function ($scope, $location, $window, dataSvc) {

    dataSvc.getUsers()
        .then(function (response) {
            $scope.users = response;
        }, function (error) {
            console.log(error)
        });

    $scope.addUser = function (ev) {

    }

    $scope.deleteUser = function (ev) {
        alert(ev.currentTarget.value);
    }

}]);

incidentAdminControllers.controller("IncidentsCtrl", ["$scope", "$location", "$window", "dataSvc", function ($scope, $location, $window, dataSvc) {

    dataSvc.getIncidents()
        .then(function (response) {
            $scope.incidents = response;
        }, function (error) {
            console.log(error)
        });

}]);

incidentAdminControllers.controller("EditContactsCtrl", ["$scope", "$location", "$window", "dataSvc", function ($scope, $location, $window, dataSvc) {
    //Edit Incident Types
    //Edit Which Codes correspond to which incidents
    //Edit which contacts correspond to which codes.
}]);