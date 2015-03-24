var incidentAdminServices = angular.module('incidentAdminServices', ['ngResource']);

incidentAdminServices.factory('testSvc', ["$http", "$q", "$window", function ($http, $q, $window) {

    function isValid() {
        return true;
    }

    return {
        isValid: isValid
    };
}]);