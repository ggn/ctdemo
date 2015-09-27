$PortalApp.controller('dashboardcontroller', function ($scope,$location, AuthService, APIService) {

    $scope.initiateDashboard = function () {
        $scope.user = AuthService.getUserDetails();
        $scope.GetSearchPatients();
    }
    
    $scope.isLoggedInUserAuthenticated = function () {
        if (AuthService.isAuthenticated()) {
            return true;
        }
        return false;
    };

    $scope.GetSearchPatients = function () {
        var res = APIService.GetSearchPatients();
        res.then(function (data) {
            $scope.patients = data;
        });
    };

    $scope.SendNotification = function () {
        $location.path('/pushNotifocation');
    };
});