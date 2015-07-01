var incidentAdminControllers = angular.module("incidentAdminControllers", ["dataServices"]);
// The alert message that appears when a database request fails.
var dangerMessage = "FATAL: database failed. Refresh and try again, or contact.";

incidentAdminControllers.controller("UsersCtrl",
        ["$scope", "$modal", "$timeout", "dataSvc", function ($scope, $modal, $timeout, dataSvc) {
    $scope.dangerAlerts = [];
    $scope.goodAlerts = [];
    refreshUsers();

    // Open add user form, take the results from it and add it to the database
    $scope.addaUser = function () {
        var modal = $modal.open({
            templateUrl: "partials/modalAddUser.html",
            controller: "AddUserModalCtrl",
            size: "sm"
        });

        modal.result.then(function (info) {
            // If yes, add the given info to the database
            dataSvc.addUser(info.username, info.role).then(function (response) {
                console.log(response);
                var alert = { msg: "User added successfully." };
                $scope.goodAlerts.push(alert);
                $timeout(function () {
                    $scope.goodAlerts.splice($scope.goodAlerts.indexOf(alert), 1);
                }, 5000);
                refreshUsers();
            }, function (error) {
                console.log(error);
                $scope.dangerAlerts.push({ msg: dangerMessage });
            });
        }, function () {
            console.log("modalAddUser Dismissed.");
        });
    }

    // Open a modal with the selected user info filled, delete user and add new info
    $scope.editUser = function (ev) {
        // Get the selected user's id
        var id = ev.currentTarget.value;
        var result = {};
        // Match that id with a user
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].id == id) {
                result = $scope.users[i];
            }
        }

        // Put that user info in the modal
        var modal = $modal.open({
            templateUrl: "partials/modalEditUser.html",
            controller: "EditUserModalCtrl",
            size: "sm",
            resolve: {
                chosen: function () { return result; }
            }
        });

        modal.result.then(function (info) {
            // if yes, delete the old info and add the new info
            dataSvc.deleteUser(info.id).then(function (response) {
                console.log(response);
                dataSvc.addUser(info.user, info.role).then(function (response) {
                    console.log(response);
                    var alert = { msg: "User edited successfully." };
                    $scope.goodAlerts.push(alert);
                    $timeout(function () {
                        $scope.goodAlerts.splice($scope.goodAlerts.indexOf(alert), 1);
                    }, 5000);
                    refreshUsers();
                }, function (error) {
                    $scope.dangerAlerts.push({ msg: dangerMessage });
                    console.log(error);
                });
            }, function (error) {
                console.log(error);
                $scope.dangerAlerts.push({ msg: dangerMessage });
            });
        }, function () {
            console.log("modalEditUser Dismissed.");
        });
    }

    // Put up a confirmation box, then delete the selected user from the database
    $scope.deleteUser = function (ev) {
        // Get the selected user's id
        var id = ev.currentTarget.value;
        var modal = $modal.open({
            templateUrl: "partials/modalRemoveUser.html",
            controller: "RemoveUserModalCtrl",
            size: "sm"
        });

        modal.result.then(function () {
            // If yes, delete the user
            dataSvc.deleteUser(id).then(function (response) {
                console.log(response);
                var alert = { msg: "User removed successfully." };
                $scope.goodAlerts.push(alert);
                $timeout(function () {
                    $scope.goodAlerts.splice($scope.goodAlerts.indexOf(alert), 1);
                }, 5000);
                refreshUsers();
            }, function (error) {
                console.log(error);
                $scope.dangerAlerts.push({ msg: dangerMessage });
            });
        }, function () {
            console.log("modalDeleteUser Dismissed");
        });
    }

    // Close the selected alert
    $scope.closeAlert = function (index) {
        $scope.goodAlerts.splice(index, 1);
    }

    // Pull all users and add them to page
    function refreshUsers() {
        dataSvc.getUsers().then(function (response) {
            $scope.users = response;
        }, function (error) {
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

}]);

incidentAdminControllers.controller("IncidentsCtrl",
        ["$scope", "$modal", "$timeout", "dataSvc", function ($scope, $modal, $timeout, dataSvc) {
    $scope.loadingIncidents = false;
    $scope.dangerAlerts = [];
    $scope.goodAlerts = [];
    $scope.results = [];
    $scope.results_num = "";

    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({ msg: dangerMessage });
    });

    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({ msg: dangerMessage });
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
        // Get the id of the clicked incident
        var id = ev.currentTarget.getAttribute("data-id");
        // Find which result matches that id
        var result = {};
        for (var i = 0; i < $scope.results.length; i++) {
            if ($scope.results[i].id == id) {
                result = $scope.results[i];
            }
        }
        // Pass that result to the modal
        var modal = $modal.open({
            templateUrl: "partials/modalChangeIncident.html",
            controller: "ChangeIncidentModalCtrl",
            size: "lg",
            resolve: {
                chosen: function () { return result; }
            }
        });

        modal.result.then(function (text) {
            $scope.results = [];
            var alert = { msg: text };
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
        // Set date params to 1980-2500 if not specified
        var after = "01/01/1980";
        if ($scope.date_after) {
            after = $scope.date_after.toLocaleDateString();
        }
        var before = "01/01/2500";
        if ($scope.date_before) {
            before = $scope.date_before.toLocaleDateString();
        }
        dataSvc.searchIncidents($scope.loc, $scope.inc, $scope.commentContains,
                after, before).then(function (response) {
            $scope.loadingIncidents = false;
            $scope.results = response;
            $scope.results_num = "Number of Results: " + $scope.results.length;
        }, function (error) {
            console.log(error);
            $scope.loadingIncidents = false;
            $scope.results = [];
            $scope.results_num = "";
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }
}]);

incidentAdminControllers.controller("EditContactsCtrl",
        ["$scope", "dataSvc", function ($scope, dataSvc) {
    //Hopefully integrate ReGroup Member API soon
    $scope.alerts = [];

    dataSvc.getContacts().then(function (response) {
        $scope.contacts = response;
    }, function (error) {
        console.log(error);
        $scope.alerts.push({ msg: dangerMessage });
    })

    $scope.editContact = function (ev) {
        // Get the id of the clicked contact
        var id = ev.currentTarget.getAttribute("data-id");
        alert("You clicked id " + id + ", ReGroup hopefully implemented soon.");
    }
}]);

incidentAdminControllers.controller("AddUserModalCtrl",
        ["$scope", "$modalInstance", "dataSvc", function ($scope, $modalInstance, dataSvc) {
    $scope.dangerAlerts = [];
    $scope.warningAlerts = [];

    $scope.add = function () {
        $scope.warningAlerts = [];
        // Check if username is filled
        if ($scope.user == null || $scope.user == "") {
            $scope.warningAlerts.push({ msg: "Please type the username." });
            if ($scope.role == null) {
                $scope.warningAlerts.push({ msg: "Please choose the role." });
            }
            return;
        }
        // Check if role is filled
        else if ($scope.role == null) {
            $scope.warningAlerts.push({ msg: "Please choose the role." });
            return;
        }
        dataSvc.getUsers().then(function (response) {
            var dupe = false;
            // For each user in database, check if username matches
            angular.forEach(response, function (value) {
                if (value.username.toLowerCase() == $scope.user.toLowerCase()) {
                    $scope.warningAlerts.push({ msg: "That Username already exists." });
                    dupe = true;
                }
            });
            // If no matches, send to be added
            if (!dupe) {
                var info = { username: $scope.user, role: $scope.role };
                $modalInstance.close(info);
            }
        }, function (error) {
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

    $scope.close = function () {
        $modalInstance.dismiss();
    }

    $scope.closeAlert = function (index) {
        $scope.warningAlerts.splice(index, 1);
    }
}]);

incidentAdminControllers.controller("EditUserModalCtrl",
        ["$scope", "$modalInstance", "dataSvc", "chosen",
        function ($scope, $modalInstance, dataSvc, chosen) {
    $scope.user = chosen.username;
    $scope.role = chosen.role;
    $scope.dangerAlerts = [];
    $scope.warningAlerts = [];

    $scope.save = function () {
        $scope.warningAlerts = [];
        // Check if username is filled
        if ($scope.user == "") {
            $scope.warningAlerts.push({ msg: "Please enter a username." });
            return;
        }
        dataSvc.getUsers().then(function (response) {
            var dupe = false;
            // For each user in database, check if username matches
            angular.forEach(response, function (value) {
                if (value.username.toLowerCase() == $scope.user.toLowerCase() &&
                        $scope.user.toLowerCase() != chosen.username.toLowerCase()) {
                    $scope.warningAlerts.push({ msg: "That username already exists." });
                    dupe = true;
                }
            });
            // If no matches or matches itself, send to be edited
            if (!dupe) {
                var info = { id: chosen.id, user: $scope.user, role: $scope.role };
                $modalInstance.close(info);
            }
        }, function (error) {
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

    $scope.close = function () {
        $modalInstance.dismiss();
    }

    $scope.closeAlert = function (index) {
        $scope.warningAlerts.splice(index, 1);
    }
}]);

incidentAdminControllers.controller("RemoveUserModalCtrl",
        ["$scope", "$modalInstance", function ($scope, $modalInstance) {
    $scope.yes = function () {
        $modalInstance.close();
    }

    $scope.no = function () {
        $modalInstance.dismiss();
    }
}]);

incidentAdminControllers.controller("ChangeIncidentModalCtrl",
        ["$scope", "$modal", "$modalInstance", "dataSvc", "chosen",
        function ($scope, $modal, $modalInstance, dataSvc, chosen) {
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
                fields: function () { return chosen; }
            }
        });

        modal.result.then(function (change) {
            dataSvc.editIncident(id, change.num, change.time, change.creator,
                    change.loc, change.inc, change.comment).then(function (response) {
                console.log(response);
                $modalInstance.close("Incident edited successfully.");
            }, function (error) {
                console.log(error);
                $scope.alerts.push({ msg: dangerMessage });
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
            size: "sm"
        });

        modal.result.then(function () {
            dataSvc.deleteIncident(id).then(function (response) {
                console.log(response);
                $modalInstance.close("Incident deleted successfully.");
            }, function (error) {
                console.log(error);
                $scope.alerts.push({ msg: dangerMessage });
            });
        }, function () {
            console.log("modalDeleteIncident Dismissed");
        });
        
    }
    
}]);

incidentAdminControllers.controller("EditIncidentModalCtrl",
        ["$scope", "$modalInstance", "dataSvc", "fields",
        function ($scope, $modalInstance, dataSvc, fields) {
    $scope.num = fields.num;
    $scope.time = fields.time;
    $scope.creator = fields.creator;
    $scope.loc = fields.location_id;
    $scope.inc = fields.type_id;
    $scope.commentEdit = fields.comment;
    $scope.dangerAlerts = [];
    $scope.warningAlerts = [];

    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        console.log(error);
        $scope.alerts.push({ msg: dangerMessage });
    });

    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        console.log(error);
        $scope.alerts.push({ msg: dangerMessage });
    });

    $scope.close = function () {
        $modalInstance.dismiss();
    }

    $scope.save = function () {
        var change = {
            id: fields.id,
            num: fields.num,
            time: fields.time,
            creator: fields.creator,
            loc: $scope.loc,
            inc: $scope.inc,
            comment: $scope.commentEdit
        };
        $modalInstance.close(change);
    }

}]);

incidentAdminControllers.controller("DeleteIncidentModalCtrl",
        ["$scope", "$modalInstance", function ($scope, $modalInstance) {
    $scope.yes = function () {
        $modalInstance.close();
    }

    $scope.no = function () {
        $modalInstance.dismiss();
    }
}]);