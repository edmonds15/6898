var incidentUserControllers = angular.module("incidentUserControllers", ["dataServices"]);
// The alert message that appears when a database request fails
var dangerMessage = "FATAL: database failed. Refresh and try again, or contact.";
var exceptions = [24, 25, 26, 27, 28, 29, 30, 31]; // Add incident ids that do not get notified here
// Implement Array indexOf for browsers that don't have it (stupid IE8)
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// Controller for the "New Incident" page
incidentUserControllers.controller("NewIncidentCtrl",
        ["$scope", "$timeout", "dataSvc", function ($scope, $timeout, dataSvc) {
    $scope.loadingIncidentRecord = false;
    $scope.notify = [];
    $scope.prior = [];
    $scope.dangerAlerts = [];
    $scope.warningAlerts = [];
    $scope.goodAlerts = [];
    var n = 0;

    // Pull all locations and put them in location dropdown
    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({ msg: dangerMessage });
    });

    // Pull all incident types and put them in incident dropdown
    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({msg: dangerMessage });
    });

    // Get next incident number, and save it
    dataSvc.getIncidentNumber().then(function (response) {
        // Set it to 1 if there are no incidents
        if (response.count == undefined) {
            n = 1;
        } else {
            n = response.count;
        }
        $scope.num = n;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({ msg: dangerMessage });
    });
    
    // Validate input, then record incident and notify Regroup
    $scope.recordIncident = function (ev) {
        $scope.warningAlerts = [];
        var inputValid = true;
        // Check if location is filled
        if ($scope.loc == null) {
            $scope.warningAlerts.push({ msg: "Please select the incident location." });
            inputValid = false;
        }
        // Check if incident is filled
        if ($scope.inc == null) {
            $scope.warningAlerts.push({ msg: "Please select the incident type." });
            inputValid = false;
        }
        // Check if comment is filled
        if ($scope.comment == undefined || $scope.comment == "") {
            $scope.warningAlerts.push({ msg: "Please enter a description of the incident." });
            inputValid = false;
        }
        if (!inputValid) {
            return;
        }
        $scope.loadingIncidentRecord = true;
        // Set comment to null if blank
        var comment = null;
        if ($scope.comment != undefined) {
            comment = "Description: " + $scope.comment + " ";   // Chris commented out 20150925
            // Chris testing this section
            //comment = $scope.comment.concat(" -- ", $scope.inc, " - ", $scope.loc);
            //console.log(comment);
            // End Chris testing
        }

        // Refresh incident number
        dataSvc.getIncidentNumber().then(function (response) {
            if (response.count == undefined) {
                n = 1;
            } else {
                n = response.count;
            }
            $scope.num = n;
        }, function (error) {
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
        // Send data to be recorded
        dataSvc.recordIncident(n, $scope.loc, $scope.inc, comment).then(function (response) {
            console.log(response);
            var recordAlert = { msg: "incident recorded successfully." };
            $scope.goodAlerts.push(recordAlert);
            $timeout(function () {
                $scope.goodAlerts.splice($scope.goodAlerts.indexOf(recordAlert), 1);
            }, 5000);
            // Update incident number
            dataSvc.getIncidentNumber().then(function (response) {
                if (response.count == undefined) {
                    n = 1;
                } else {
                    n = response.count;
                }
                $scope.num = n;
            }, function (error) {
                console.log(error);
                $scope.dangerAlerts.push({ msg: dangerMessage });
            });

            // Notify Regroup except for certain groups
            // If the incident is not in exceptions, notify Regroup
            console.log(exceptions.indexOf($scope.inc));
            if (exceptions.indexOf($scope.inc) == -1) {
                dataSvc.regroupNotify($scope.loc, $scope.inc, $scope.comment).then(function (response) {
                    $scope.goodAlerts.push(response);
                    $timeout(function () {
                        $scope.goodAlerts.splice($scope.goodAlerts.indexOf(response), 1);
                    }, 5200);
                }, function (error) {
                    $scope.warningAlerts.push(error);
                });
            }

            // Clear Fields
            $scope.loc = null;
            $scope.inc = null;
            $scope.comment = "";
            $scope.prior = [];
            $scope.notify = [];
            $scope.loadingIncidentRecord = false;
        }, function (error) {
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
            $scope.warningAlerts.push({ msg: "Regroup notification canceled." });
            $scope.loc = null;
            $scope.inc = null;
            $scope.comment = "";
            $scope.prior = [];
            $scope.notify = [];
            $scope.loadingIncidentRecord = false;
        });
    }

    // Pull the notification list for the selected incident and display it
    $scope.updateNotify = function () {
        dataSvc.getWhoNotify($scope.inc).then(function (response) {
            $scope.notify = response;
        }, function (error) {
            $scope.notify = [];
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

    // Pull the prior incidents for the selected location and display it
    $scope.updatePrior = function () {
        dataSvc.searchIncidents($scope.loc, null, null, null, null).then(function (response) {
            $scope.prior = response;
        }, function (error) {
            $scope.prior = [];
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

    // Close the selected yellow alert
    $scope.closeBadAlert = function (index) {
        $scope.warningAlerts.splice(index, 1);
    }

    // Close the selected green alert
    $scope.closeGoodAlert = function (index) {
        $scope.goodAlerts.splice(index, 1);
    }
}]);

// Controller for the "Update Incidents" page
incidentUserControllers.controller("UpdateIncidentsCtrl",
        ["$scope", "$timeout", "dataSvc", function ($scope, $timeout, dataSvc) {
    $scope.dangerAlerts = [];
    $scope.goodAlerts = [];

    dataSvc.getIncidents().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        console.log(error);
        $scope.dangerAlerts.push({ msg: dangerMessage });
    });

    $scope.updateIncident = function (ev) {
        var inputValid = true;
        if ($scope.inc == null) {
            console.log("Please select an incident.");
            inputValid = false;
        }
        if ($scope.comment == undefined || $scope.comment == "") {
            console.log("Please enter an update.");
            inputValid = false;
        }
        if (!inputValid) {
            return;
        }
        var comment = "UPDATE: " + $scope.comment + " ";
        dataSvc.updateIncident($scope.inc, comment).then(function (response) {
            console.log(response);
            var msg = { msg: "Incident updated successfully." }
            $scope.goodAlerts.push(msg);
            $timeout(function () {
                $scope.goodAlerts.splice($scope.goodAlerts.indexOf(msg), 1);
            }, 5000);

            // Get info from incident
            dataSvc.getIncidentInfo($scope.inc).then(function (response) {
                // Send Update info to Regroup
                console.log(exceptions);
                console.log(response.incID);
                console.log(exceptions.indexOf(response.incID) == -1);
                if (exceptions.indexOf(response.incID) == -1) {
                    dataSvc.regroupNotify(response.locID, response.incID, comment).then(function (response) {
                        $scope.goodAlerts.push(response);
                        $timeout(function () {
                            $scope.goodAlerts.splice($scope.goodAlerts.indexOf(response), 1);
                        }, 5200);
                    }, function (error) {
                        $scope.warningAlerts.push(error);
                    });
                }
            }, function (error) {
                console.log(error);
                $scope.dangerAlerts.push({ msg: dangerMessage });
            });
            $scope.inc = null;
            $scope.comment = "";
        }, function (error) {
            console.log(error);
            $scope.dangerAlerts.push({ msg: dangerMessage });
        });
    }

    $scope.closeGoodAlert = function (index) {
        $scope.goodAlerts.splice(index, 1);
    }
}]);

// Controller for the "Search Incidents" page
incidentUserControllers.controller("SearchIncidentCtrl",
        ["$scope", "dataSvc", function ($scope, dataSvc) {
    $scope.loadingIncidents = false;
    $scope.alerts = [];
    $scope.results = [];
    $scope.results_num = "";

    // Pull all locations and put them in location dropdown
    dataSvc.getLocations().then(function (response) {
        $scope.locations = response;
    }, function (error) {
        console.log(error);
        $scope.alerts.push({ msg: dangerMessage });
    });

    // Pull all incident types and put them in incident dropdown
    dataSvc.getIncidentTypes().then(function (response) {
        $scope.incidents = response;
    }, function (error) {
        console.log(error);
        $scope.alerts.push({ msg: dangerMessage });
    });

    // Wipe all fields and previous results
    $scope.clearFields = function (ev) {
        $scope.loc = null;
        $scope.inc = null;
        $scope.commentContains = null;
        $scope.date_after = null;
        $scope.date_before = null;
        $scope.results_num = "";
        $scope.results = [];
    }

    // Pull incidents matching search params, and display
    $scope.searchIncidents = function (ev) {
        $scope.loadingIncidents = true;

        // Use date params 1980-2500 if not given
        var after = "01/01/1980";
        if ($scope.date_after) {
            after = $scope.date_after.toLocaleDateString();
        }
        var before = "01/01/2500";
        if ($scope.date_before) {
            before = $scope.date_before.toLocaleDateString();
        }

        // Send info to pull incidents
        dataSvc.searchIncidents($scope.loc, $scope.inc, $scope.commentContains,
                after, before).then(function (response) {
            $scope.loadingIncidents = false;
            $scope.results = response;
            $scope.results_num = "Number of Results: " + $scope.results.length;
        }, function (error) {
            console.log(error);
            $scope.results_num = "";
            $scope.results = [];
            $scope.loadingIncidents = false;
            $scope.alerts.push({ msg: dangerMessage });
        });
    }
}]);