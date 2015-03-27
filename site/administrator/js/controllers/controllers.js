var incidentAdminControllers = angular.module('incidentAdminControllers', ['dataServices']);
var gTest;
incidentAdminControllers.controller("HomeCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window, $modal) {

}]);

incidentAdminControllers.controller("HelpCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

}]);

incidentAdminControllers.controller("UsersCtrl", ["$scope", "$location", "$window", "dataSvc", "$modal", function ($scope, $location, $window, dataSvc, $modal) {
    refreshUsers();

    $scope.addaUser = function (ev) {
        var modal = $modal.open({
            templateUrl: "partials/modalAddUser.html",
            controller: "UserModalCtrl",
            size: 'sm'
        })

        modal.result.then(function (info) {
            console.log(info);
            console.log(info.username);
            console.log(info.role);
            dataSvc.addUser(info.username, info.role)
                .then(function (response) {
            refreshUsers();
            }, function (error) {
                console.log(error)
            })
            console.log(info);
        }, function () {
            console.log("Model Dismissed");
        });
    }

    $scope.deleteUser = function (ev) {
        var id = ev.currentTarget.value;
        dataSvc.deleteUser(id)
        .then(function (response) {
            refreshUsers();
        }, function (error) {
            console.log(error)
        });
    }

    function refreshUsers() {
        dataSvc.getUsers()
        .then(function (response) {
            $scope.users = response;
        }, function (error) {
            console.log(error)
        });
    }

}]);

incidentAdminControllers.controller("IncidentsCtrl", ["$scope", "$location", "$window", "dataSvc", "$modal", function ($scope, $location, $window, dataSvc, $modal) {

    $scope.loadingIncidents = false;
    $scope.results = [];
    $scope.results_num = "";
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
                    console.log(error);
                });
        };

        $scope.changeIncident = function (ev) {
            var id = ev.currentTarget.getAttribute("data-id");
            $scope.mResult = {};
            for (var i = 0; i < $scope.results.length; i++) {
                if ($scope.results[i].id == id) {
                    $scope.mResult = $scope.results[i];
                }
            }
            var modal = $modal.open({
                templateUrl: "partials/modalChangeIncident.html",
                controller: "ChangeIncidentModalCtrl",
                size: 'lg',
                scope: $scope
            })

            modal.result.then(function (user, role) {
               
            }, function () {
                //log.info("Model Dismissed");
            });

        };
    /*function updateIncidents() {
        dataSvc.getIncidents()
        .then(function (response) {
            $scope.incidents = response;
        }, function (error) {
            console.log(error)
        });
    }*/
}]);

incidentAdminControllers.controller("EditContactsCtrl", ["$scope", "$location", "$window", "dataSvc", function ($scope, $location, $window, dataSvc) {
    //Edit Incident Types
    //Edit Which Codes correspond to which incidents
    //Edit which contacts correspond to which codes.
}]);

incidentAdminControllers.controller("UserModalCtrl", ["$scope", "$modalInstance", function ($scope, $modalInstance) {

    $scope.add = function () {
        var username = $scope.user;
        var role = $scope.role;
        console.log(username);
        console.log(role);
        var info = {username: $scope.user, role: $scope.role}
        $modalInstance.close(info);
    }

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    }
}]);

incidentAdminControllers.controller("ChangeIncidentModalCtrl", ["$scope", "$modal", "$modalInstance", "dataSvc", function ($scope, $modal, $modalInstance, dataSvc) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    }

    $scope.edit = function () {
        //$modalInstance.dismiss('cancel');
        var id = $scope.mResult.id;
        var modal = $modal.open({
            templateUrl: "partials/modalEditIncident.html",
            controller: "EditIncidentModalCtrl",
            size: 'lg',
            scope: $scope
        });
    };

    $scope.delete = function () {
        var id = $scope.mResult.id;
        dataSvc.deleteIncident(id)
        .then(function (response) {
            $scope.results = [];
            $modalInstance.dismiss('cancel');
        }, function (error) {
            $modalInstance.dismiss('cancel');
            console.log(error);
        });
        
    }
    
}]);

incidentAdminControllers.controller("EditIncidentModalCtrl", ["$scope", "$rootScope", "$modalInstance", "dataSvc", function ($scope, $rootScope, $modalInstance, dataSvc) {
    $scope.commentEdit = $scope.mResult.comment;
    $scope.locSel = [];
    $scope.incSel = [];

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
    $scope.locSel[$scope.mResult.location_id] = true;
    $scope.incSel[$scope.mResult.type_id] = true;

    $scope.close2 = function () {
        $modalInstance.dismiss('cancel');
        $scope.close();
    }

    $scope.save = function () {
        alert("Saving..." + $scope.inc);
    }

    

}]);