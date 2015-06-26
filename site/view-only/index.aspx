<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="bin/6898.dll" Inherits="_6898.view_only.index" %>

<!DOCTYPE html>

<html lang="en" ng-app="incidentViewOnlyApp">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <title>View-Only - Incident Report</title>
    
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/angular_material/0.10.0/angular-material.min.css">
    <link rel="stylesheet" href="../css/style.css">

    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-route.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-resource.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angular_material/0.10.0/angular-material.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.13.0/ui-bootstrap-tpls.min.js"></script>

    <script type="text/javascript" src='js/app.js'></script>
    <script type="text/javascript" src="../services/dataService.js"></script>

</head>
<body ng-controller="SearchCtrl">
    <div class='container col-centered'>
	    <h2>6898 Incident Reporting Application (View-Only Page) - Edmonds School District</h2>
        <h3>Logged in as: <asp:Literal id="nameLiteral" runat="server" /><asp:Literal ID="roleLiteral" runat="server" /></h3>
        <ul class="nav nav-tabs">
            <li role="presentation" class="active"><a href="#/search/">Search Incidents</a></li>
        </ul>
        <alert ng-repeat="alert in alerts" type="danger">{{alert.msg}}</alert>
        <h2>Search Reported Incidents</h2>
        <div class="row" >
            <div class="col-xs-6">
                <md-select class="location" placeholder="Search by Location" ng-model="loc">
                    <md-option ng-repeat="location in locations" value="{{location.id}}">{{location.name}}</md-option>
                </md-select>
            </div>
            <div class="col-xs-6">
                <md-select class="incident" placeholder="Search by Incident" ng-model="inc">
                    <md-option ng-repeat="incident in incidents" value="{{incident.id}}">{{incident.type}}</md-option>
                </md-select>
            </div>
        </div>

        <div class="row" layout-align="center" style="display:inline-block">
            <md-input-container class="date_after" style="float:left;">
                <label>Date Before/On Incident</label>
                <input type="date" ng-model="date_after">
            </md-input-container>
            <md-input-container class="date_before" style="float:left;">
                <label>Date After Incident</label>
                <input type="date" ng-model="date_before">
            </md-input-container>
        </div>

        <div class="row">
            <md-input-container style="display:inline-block">
                <label>Comment Contains</label>
                <input ng-model="commentContains">
            </md-input-container>
        </div>

        <div class="row">
            <md-button class="md-raised md-primary search" ng-click="searchIncidents($event)" ng-disabled="loadingIncidents">Search</md-button>
            <md-button class="md-accent md-raised md-hue-1 search" ng-click="clearFields($event)">Clear Fields</md-button>
        </div>

        <div class="row">
            <md-progress-circular md-mode="indeterminate" ng-show="loadingIncidents"></md-progress-circular>
        </div>

        </ br>

        <div class="row">
            <h3>{{results_num}}</h3>
            <div class="result" ng-repeat="result in results">
                <h3><u>Incident Number: {{result.num}}</u></h3>
                <p><b>Creation Time:</b> {{result.time}} - <b>Creator:</b> {{result.creator}}</p>
                <p><b>Location:</b> {{result.location}} - <b>Incident:</b> {{result.type}}</p>
                <p><b>Comment:</b> {{result.comment}}</p>
            </div>
        </div>
	</div>
</body>
</html>