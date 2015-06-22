<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="bad_permissions.aspx.cs" Inherits="_6898.bad_permissions" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <title>Incident Report Permission Error</title>    

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/angular_material/0.10.0/angular-material.min.css">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="container col-centered">
        <h2>Incident Reporting Application (Permission Error)- Edmonds School District</h2>
        <h3>Logged in as: <asp:Literal id="nameLiteral" runat="server" /></h3>
    </div>
    <div class="row">
        <h3>Error: Access Denied</h3><br />
        You do not have access to this page. If you believe this was in error, contact Information Systems in Technology Department.<br />
        Click <a href="/">here</a> to access a lower level page.
    </div>
</body>
</html>
