<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="bin/6898.dll" Inherits="_6898.user.index" %>

<!DOCTYPE html>

<html ng-app ="incidentUserApp">
<head>
    <meta charset='utf-8' />
	<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no' />
    <title>User - Incident Report</title>

    <link rel='stylesheet' href="//netdna.bootstrapcdn.com/bootstrap/3.0.1/css/bootstrap.min.css">
    <link rel='stylesheet' href='/css/style.css'>

    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-animate.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-aria.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angular_material/0.8.2/angular-material.min.js"></script>
	<script type="text/javascript" src='//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.8/angular-resource.min.js'></script>	

    <script type="text/javascript" src='js/app.js'></script>
</head>
<body ng-controller ="UserCtrl">
    <div class ="container col-centered">
        <div class ="row">
            <div class ="col-xs-6">Date and Time</div>
            <div class ="col-xs-6">Incident Number</div>
        </div>
        <div class ="row">
            <div class ="col-xs-6">
                <md-select placeholder="Select a Location" ng-model="loc">
                    <md-option ng-repeat="location in locations" value="{{location.id}}">{{location.name}}</md-option>
                </md-select>
            </div>
            <div class ="col-xs-6">Type of Incident</div>
        </div>
        <div class ="row">
            <div class ="col-xs-6">History Display</div>
            <div class ="col-xs-6">Notification Activation</div>
        </div>
        <div class ="form-group">
            <label for="comment">Comments:</label>
            <textarea class="form-control" rows="8" id="comment"></textarea>
        </div>
    </div>
    <p>
        {{test}}
    </p>
</body>
</html>
