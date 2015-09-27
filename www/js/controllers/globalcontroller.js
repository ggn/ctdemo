
$PortalApp.controller('globalController', function ($scope, AuthService, $location) {

    function onDeviceReady() {
        // Now safe to use the Cordova API
    }
    document.addEventListener("deviceready", onDeviceReady, false);


    $scope.logout = function () {
        AuthService.logout();
        $location.path("/login");
    };

    $scope.redirect = function () {
        $location.path("");
    }

    $scope.isUserAuthenticated = function () {
        if (AuthService.isAuthenticated()) {
            return true;
        }
        return false;
    };

    var onConfirm = function (button) {
        if (button == 2) {//If User selected No, then we just do nothing
            return;
        } else {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
    }
    $scope.confirmExit = function () {
        navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No");
    }

    $scope.UserName = AuthService.isAuthenticated();
    $scope.GetDateTimeNow = function () {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dateTime = new Date();
        return (dateTime.getDate() + "-" + monthNames[dateTime.getMonth()] + "-" + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes() + " EST");
    }

    $scope.$on("adal:loginSuccess", function () {
        $scope.UserName = AuthService.isAuthenticated();
        $location.path("/dashboard");
    });

    $scope.$on("adal:loginFailure", function () {
        alert("Failure");
    });

    $scope.$on("vibrate", function (secs) {
        if (window.navigator && window.navigator.vibrate) {
            navigator.vibrate(secs);
        } else {
            console.log("Unable to vibrate");
        }
    });

    $scope.initiate = function () {
        var userToken = AuthService.isAuthenticated();
        if (($location.path() == "/" || $location.path() == "") && userToken) {
            $location.path("/dashboard");
        }
    };
});

