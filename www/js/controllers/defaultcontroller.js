$PortalApp.controller('defaultController', function ($scope, $http, AuthService) {
    history.pushState(null, null, location.href);      
    window.onpopstate = function (event) {
        history.go(1);
    };

    $scope.isUserAuthenticatic = function () {
        return AuthService.isAuthenticated();
    };
});

   
