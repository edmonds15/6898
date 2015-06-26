<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="bin/6898.dll" Inherits="_6898.user.index" %>

<!DOCTYPE html>

<html lang="en" ng-app="incidentUserApp">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <title>User - Incident Report</title>

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
    <script type="text/javascript" src="js/controllers.js"></script>
    <script type="text/javascript" src="../services/dataService.js"></script>
</head>
<body>
    <div class="container col-centered">
        <h2>6898 Incident Reporting Application - Edmonds School District</h2>
        <h3>Logged in as: <asp:Literal id="nameLiteral" runat="server" /> - <asp:Literal ID="roleLiteral" runat="server" /></h3>
        <div ng-view></div>
    </div>
</body>
</html>
