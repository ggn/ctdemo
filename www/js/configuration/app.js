var $PortalApp = angular.module('MEYE', ['ngRoute']);

$PortalApp.config(function ($routeProvider, $httpProvider) {
    $routeProvider.when("/", {
            templateUrl: "Views/home.html",
            controller: "",
        }).when("/whatisglaucoma", {
            templateUrl: "Views/glaucoma/whatis.html",
            controller: "",
            requiresLogin: false
        }).when("/detect", {
            templateUrl: "Views/detector/detection.html",
            controller: "detectorcontroller",
            requiresLogin: false
        }).when("/ctdemo", {
            templateUrl: "Views/citiustech/ctdemo.html",
            controller: "ctdemocontroller",
            requiresLogin: false
        }).when("/innovationlabdemo", {
            templateUrl: "Views/citiustech/innovationlabdemo.html",
            controller: "innovationlabdemocontroller",
            requiresLogin: false
        }).when("/FAQ", {
            templateUrl: "Views/glaucoma/FAQ.html",
            controller: "faqcontroller",
            requiresLogin: false
        })
        .otherwise({
            redirectTo: '/'
        });
}).run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
        if (next.requiresLogin && !AuthService.isAuthenticated()) {
            console.log('Unauthorised User');
            event.preventDefault();
            $location.path('/login');
        } else {
            return $location.path;
        }
    });
}]);