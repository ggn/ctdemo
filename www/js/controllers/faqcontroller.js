$PortalApp.controller('faqcontroller', function ($scope, $http, AuthService) {
    $scope.displayans = function (n) {
        $('p[id*=demo]').not('#demo' + n).hide();
        $('#demo' + n).toggle();
    }
    $scope.reset = function () {
        window.localStorage.clear();
        alert("Data Cleared");
    }
});


