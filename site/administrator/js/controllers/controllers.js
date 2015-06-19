var incidentAdminControllers = angular.module('incidentAdminControllers', ['dataServices']);

incidentAdminControllers.controller("HomeCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

}]);

incidentAdminControllers.controller("HelpCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

}]);

incidentAdminControllers.controller("UsersCtrl", ["$scope", "$location", "$window", "dataSvc", "$modal", function ($scope, $location, $window, dataSvc, $modal) {
    refreshUsers();

    $scope.addaUser = function (ev) {
        var modal = $modal.open({
            templateUrl: "partials/modalAddUser.html",
            controller: "AddUserModalCtrl",
            size: 'sm'
        });

        modal.result.then(function (info) {
            console.log(info);
            console.log(info.username);
            console.log(info.role);
            dataSvc.addUser(info.username, info.role)
                .then(function (response) {
                refreshUsers();
            }, function (error) {
                console.log(error);
            })
            console.log(info);
        }, function () {
            console.log("Model Dismissed");
        });
    }

    $scope.deleteUser = function (ev) {
        var id = ev.currentTarget.value;
        var modal = $modal.open({
            templateUrl: "partials/modalRemoveUser.html",
            controller: "RemoveUserModalCtrl",
            size: "sm"
        });

        modal.result.then(function () {
            dataSvc.deleteUser(id)
                .then(function (response) {
                    refreshUsers();
                }, function (error) {
                    console.log(error);
                });
        }, function () {
            console.log("Model Dismissed");
        })
    }

    function refreshUsers() {
        dataSvc.getUsers()
        .then(function (response) {
            $scope.users = response;
        }, function (error) {
            console.log(error);
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
    }

    $scope.changeIncident = function (ev) {
        var id = ev.currentTarget.getAttribute("data-id");
        $scope.mResult = {};
        for (var i = 0; i < $scope.results.length; i++) {
            if ($scope.results[i].num == id) {
                $scope.mResult = $scope.results[i];
            }
        }
        var modal = $modal.open({
            templateUrl: "partials/modalChangeIncident.html",
            controller: "ChangeIncidentModalCtrl",
            size: 'lg',
            resolve: {
                chosen: function () {
                    return $scope.mResult;
                }
            }
        });

        modal.result.then(function () {
            $scope.results = [];
            updateIncidents();
        }, function () {
            console.log("Model Dismissed");
        });
    };

    function updateIncidents() {
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
    }
}]);

incidentAdminControllers.controller("EditContactsCtrl", ["$scope", "$location", "$window", "dataSvc", function ($scope, $location, $window, dataSvc) {
    //Edit Which Codes correspond to which incidents
    //Edit which contacts correspond to which codes.
}]);

incidentAdminControllers.controller("AddUserModalCtrl", ["$scope", "$modalInstance", function ($scope, $modalInstance) {

    $scope.add = function () {
        if ($scope.user == null) {
            alert("Error: Username not set, please enter the username");
            return;
        }
        if ($scope.role == null) {
            alert("Error: Role not set, please choose a role");
            return;
        }
        var info = { username: $scope.user, role: $scope.role };
        $modalInstance.close(info);
    }

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    }
}]);

incidentAdminControllers.controller("RemoveUserModalCtrl", ["$scope", "$modalInstance", function ($scope, $modalInstance) {
    $scope.yes = function () {
        $modalInstance.close();
    }

    $scope.no = function () {
        $modalInstance.dismiss('cancel');
    }
}]);

incidentAdminControllers.controller("ChangeIncidentModalCtrl", ["$scope", "$modal", "$modalInstance", "dataSvc", "chosen", function ($scope, $modal, $modalInstance, dataSvc, chosen) {
    $scope.num = chosen.num;
    $scope.time = chosen.time;
    $scope.creator = chosen.creator;
    $scope.location = chosen.location;
    $scope.type = chosen.type;
    $scope.comment = chosen.comment;

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    }

    $scope.edit = function () {
        var id = chosen.id;
        var modal = $modal.open({
            templateUrl: "partials/modalEditIncident.html",
            controller: "EditIncidentModalCtrl",
            size: 'lg',
            resolve: {
                fields: function () {
                    return chosen;
                }
            }
        });

        modal.result.then(function (change) {
            console.log(change);
            dataSvc.editIncident(id, change.num, change.time, change.creator, change.loc, change.inc, change.comment)
                .then(function (response) {
                    $modalInstance.close();
                }, function (error) {
                    $modalInstance.dismiss("cancel");
                    console.log(error);
                });
        }, function () {
            console.log("Model Dismissed");
        });
    };

    $scope.delete = function () {
        var id = chosen.id;
        var modal = $modal.open({
            templateUrl: "partials/modalDeleteIncident.html",
            controller: "DeleteIncidentModalCtrl",
            size: 'sm',
        });

        modal.result.then(function () {
            dataSvc.deleteIncident(id)
                .then(function (response) {
                    $modalInstance.close();
                }, function (error) {
                    $modalInstance.dismiss('cancel');
                    console.log(error);
                });
            $modalInstance.close();
        }, function () {
            console.log("Model Dismissed");
        });
        
    }
    
}]);

incidentAdminControllers.controller("EditIncidentModalCtrl", ["$scope", "$rootScope", "$modalInstance", "dataSvc", "fields", function ($scope, $rootScope, $modalInstance, dataSvc, fields) {
    $scope.num = fields.num;
    $scope.time = fields.time;
    $scope.creator = fields.creator;
    $scope.loc = fields.location_id;
    $scope.inc = fields.type_id;
    $scope.commentEdit = fields.comment;

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

    $scope.close2 = function () {
        $modalInstance.dismiss('cancel');
    }

    $scope.save = function () {
        var change = { id: fields.id, num: fields.num, time: fields.time, creator: fields.creator, loc: $scope.loc, inc: $scope.inc, comment: $scope.commentEdit };
        $modalInstance.close(change);
    }

}]);

incidentAdminControllers.controller("DeleteIncidentModalCtrl", ["$scope", "$modalInstance", function ($scope, $modalInstance) {
    $scope.yes = function () {
        $modalInstance.close();
    }

    $scope.no = function () {
        $modalInstance.dismiss("cancel");
    }
}]);