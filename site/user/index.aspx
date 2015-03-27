<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="bin/6898.dll" Inherits="_6898.user.index" %>

<!DOCTYPE html>

<html ng-app ="incidentUserApp">
<head>
    <meta charset='utf-8' />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no' />
    <title>User - Incident Report</title>

    <link rel='stylesheet' href="//netdna.bootstrapcdn.com/bootstrap/3.0.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/angular_material/0.8.2/angular-material.min.css">
    <link rel='stylesheet' href='../css/style.css'>

    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-animate.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-aria.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angular_material/0.8.2/angular-material.min.js"></script>
	<script type="text/javascript" src='//ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-route.js'></script>
	<script type="text/javascript" src='//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.8/angular-resource.min.js'></script>	

    <script type="text/javascript" src='js/app.js'></script>
    <script type="text/javascript" src="js/controllers.js"></script>
    <script type="text/javascript" src="../services/dataService.js"></script>
</head>
<body>
    <div class ="container col-centered">
        <h1>Incident Reporting Application - Edmonds School District</h1>
        <h2>Logged in as: <asp:Literal id="nameLiteral" runat="server" /> - <asp:Literal ID="roleLiteral" runat="server" /></h2>
        <div ng-view></div>
    </div>
</body>
</html>
