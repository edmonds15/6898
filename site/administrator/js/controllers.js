var incidentAdminControllers = angular.module("incidentAdminControllers", ["dataServices"]);

var dangerMessage = "FATAL: database failed. Refresh and try again, or contact."

incidentAdminControllers.controller("UsersCtrl", ["$scope", "$location", "$window", "$modal", "$timeout", "dataSvc", function ($scope, $location, $window, $modal, $timeout, dataSvc) {
    $scope.dangerAlerts = [];
    $scope.goodAlerts = [];
    refreshUsers();

    $scope.addaUser = function (ev) {
        $scope.goodAlerts = [];
        var modal = $modal.open({
            templateUrl: "partials/modalAddUser.html",
            controller: "AddUserModalCtrl",
            size: "sm"
        });

        modal.result.then(function (info) {
            dataSvc.addUser(info.username, info.role).then(function (response) {
                var alert = { msg: "User added successfully." };
                $scope.goodAlerts.push(alert);
                $timeout(function () {
                    $scope.goodAlerts.splice($scope.goodAlerts.indexOf(alert), 1);
                }, 5000);
                console.log(response);
                refreshUsers();
            }, function (error) {
                $scope.dangerAlerts.push({ msg: dangerMessage });
                console.log(error);
            });
        }, function () {
            console.log("modalAddUser Dismissed.");
        });
    }

    $scope.deleteUser = function (ev) {
        $scope.goodAlerts = [];
        var id = ev.currentTarget.value;
        var modal = $modal.open({
            templateUrl: "partials/modalRemoveUser.html",
            controller: "RemoveUserModalCtrl",
            size: "sm"
        });

        modal.result.then(function () {
            dataSvc.deleteUser(id).then(function (response) {
                var alert = { msg: "User deleted successfully." };
                $scope.goodAlerts.push(alert);
                $timeout(function () {
                    $scope.goodAlerts.splice($scope.goodAlerts.indexOf(alert), 1);
                }, 5000);
                console.log(response);
                refreshUsers();
            }, function (error) {
                $scope.dangerAlerts.push({ msg: dangerMessage });
                console.log(error);
            });
        }, function () {
            console.log("modalDeleteUser Dismissed");
        });
    }

    $scope.closeAlert = function (index) {
        $scope.goodAlerts.splice(index, 1);
    }

    function refreshUsers() {
        dataSvc.getUsers().then(function (response) {
            $scope.users = response;
        }, function (error) {
            $scope.dangerAlerts.push({ msg: dangerMessage });
            console.log(error);
        });
    }

}]);

incidentAdminControllers.controller("IncidentsCtrl", ["$scope", "$location", "$window", "$modal", "$timeout", "dataSvc", function ($scope, $location, $window, $modal, $timeout, dataSvc) {
    $scope.loadingIncidents = false;
    $scope.dangerAlerts = [];
    $scope.goodAlerts = [];
    $scope.results = [];
    $scope.results_num = "";

    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        $scope.dangerAlerts.push({ msg: dangerMessage });
        console.log(error);
    });

    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        $scope.dangerAlerts.push({ msg: dangerMessage });
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
        $scope.goodAlerts = [];
    }

    $scope.searchIncidents = function () {
        updateIncidents();
    }

    $scope.changeIncident = function (ev) {
        var id = ev.currentTarget.getAttribute("data-id");
        var result = {};
        for (var i = 0; i < $scope.results.length; i++) {
            if ($scope.results[i].num == id) {
                result = $scope.results[i];
            }
        }
        var modal = $modal.open({
            templateUrl: "partials/modalChangeIncident.html",
            controller: "ChangeIncidentModalCtrl",
            size: "lg",
            resolve: {
                chosen: function () {
                    return result;
                }
            }
        });

        modal.result.then(function (text) {
            $scope.results = [];
            var alert = { msg: text };
            console.log(text);
            $scope.goodAlerts.push(alert);
            $timeout(function () {
                $scope.goodAlerts.splice($scope.goodAlerts.indexOf(alert), 1);
            }, 5000);
            updateIncidents();
        }, function () {
            console.log("modalChangeIncident Dismissed");
        });
    }

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
        dataSvc.searchIncidents($scope.loc, $scope.inc, $scope.commentContains, after, before).then(function (response) {
            $scope.loadingIncidents = false;
            $scope.results = response;
            $scope.results_num = "Number of Results: " + $scope.results.length;
        }, function (error) {
            $scope.loadingIncidents = false;
            $scope.results = [];
            $scope.results_num = "";
            $scope.dangerAlerts.push({ msg: dangerMessage });
            console.log(error);
        });
    }
}]);

incidentAdminControllers.controller("EditContactsCtrl", ["$scope", "$location", "$window", "dataSvc", function ($scope, $location, $window, dataSvc) {
    //Hopefully integrate ReGroup Member API
    $scope.alerts = [];

    dataSvc.getContacts().then(function (response) {
        $scope.contacts = response;
    }, function (error) {
        $scope.alerts.push({ msg: dangerMessage });
        console.log(error);
    })

    $scope.editContact = function (ev) {
        var id = ev.currentTarget.getAttribute("data-id");
        alert("You clicked id " + id + ", ReGroup hopefully implemented soon.")
    }
}]);

incidentAdminControllers.controller("AddUserModalCtrl", ["$scope", "$modalInstance", "dataSvc", function ($scope, $modalInstance, dataSvc) {
    $scope.dangerAlerts = [];
    $scope.warningAlerts = [];

    $scope.add = function () {
        $scope.warningAlerts = [];
        if ($scope.user == null || $scope.user == "") {
            $scope.warningAlerts.push({ msg: "Please type the username." });
            if ($scope.role == null) {
                $scope.warningAlerts.push({ msg: "Please choose the role." });
            }
            return;
        }
        else if ($scope.role == null) {
            $scope.warningAlerts.push({ msg: "Please choose the role." });
            return;
        }
        dataSvc.getUsers().then(function (response) {
            var dupe = false;
            angular.forEach(response, function (value) {
                if (value.username.toLowerCase() == $scope.user.toLowerCase()) {
                    $scope.warningAlerts.push({ msg: "That Username already exists." });
                    dupe = true;
                }
            });
            if (!dupe) {
                var info = { username: $scope.user, role: $scope.role };
                $modalInstance.close(info);
            }
        }, function (error) {
            $scope.dangerAlerts.push({ msg: dangerMessage });
            console.log(error);
        });
    }

    $scope.close = function () {
        $modalInstance.dismiss();
    }

    $scope.closeAlert = function (index) {
        $scope.warningAlerts.splice(index, 1);
    }
}]);

incidentAdminControllers.controller("RemoveUserModalCtrl", ["$scope", "$modalInstance", function ($scope, $modalInstance) {
    $scope.yes = function () {
        $modalInstance.close();
    }

    $scope.no = function () {
        $modalInstance.dismiss();
    }
}]);

incidentAdminControllers.controller("ChangeIncidentModalCtrl", ["$scope", "$modal", "$modalInstance", "dataSvc", "chosen", function ($scope, $modal, $modalInstance, dataSvc, chosen) {
    $scope.num = chosen.num;
    $scope.time = chosen.time;
    $scope.creator = chosen.creator;
    $scope.location = chosen.location;
    $scope.type = chosen.type;
    $scope.comment = chosen.comment;
    $scope.alerts = [];

    $scope.close = function () {
        $modalInstance.dismiss();
    }

    $scope.edit = function () {
        var id = chosen.id;
        var modal = $modal.open({
            templateUrl: "partials/modalEditIncident.html",
            controller: "EditIncidentModalCtrl",
            size: "lg",
            resolve: {
                fields: function () {
                    return chosen;
                }
            }
        });

        modal.result.then(function (change) {
            dataSvc.editIncident(id, change.num, change.time, change.creator, change.loc, change.inc, change.comment).then(function (response) {
                console.log(response);
                $modalInstance.close("Incident edited successfully.");
            }, function (error) {
                $scope.alerts.push({ msg: dangerMessage });
                console.log(error);
            });
        }, function () {
            console.log("modalEditIncident Dismissed");
        });
    }

    $scope.delete = function () {
        var id = chosen.id;
        var modal = $modal.open({
            templateUrl: "partials/modalDeleteIncident.html",
            controller: "DeleteIncidentModalCtrl",
            size: "sm",
        });

        modal.result.then(function () {
            dataSvc.deleteIncident(id).then(function (response) {
                console.log(response);
                $modalInstance.close("Incident deleted successfully.");
            }, function (error) {
                $scope.alerts.push({ msg: dangerMessage });
                console.log(error);
            });
        }, function () {
            console.log("modalDeleteIncident Dismissed");
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
    $scope.alerts = [];

    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        $scope.alerts.push({ msg: dangerMessage });
        console.log(error);
    });

    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        $scope.alerts.push({ msg: dangerMessage });
        console.log(error);
    });

    $scope.close2 = function () {
        $modalInstance.dismiss();
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
        $modalInstance.dismiss();
    }
}]);