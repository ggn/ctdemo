$PortalApp.service("APIService", function ($http, $window, $q,$location, AuthService) {
    var APIAccessLayer = {};

    APIAccessLayer.callApi = function (apiConfig) {
        var deferred = $q.defer();
        var token = AuthService.isAuthenticated();
        var httpRequest = {
            method: apiConfig.type,
            url: $PortalApp.Enums.Environment.PortalAPIBaseUrl + apiConfig.suffixUrl,
            headers: { 'Authorization': token ? token.accessToken : "" },
            data: apiConfig.data
        };
        $http(httpRequest).success(function (data) { deferred.resolve(data); }).error(function (data) { deferred.resolve(data); });
        return deferred.promise;
    };

    APIAccessLayer.callApiWithValidToken = function (apiConfig) {
        var userToken = AuthService.isAuthenticated();
        var newToken = null;
        if (userToken) {
            var validTokenName = AuthService.getValidTokenName(userToken);
            switch (validTokenName) {
                case $PortalApp.Enums.Constants.ACCESSTOKEN:
                    return APIAccessLayer.callApi(apiConfig);
                case $PortalApp.Enums.Constants.REFRESHTOKEN:
                    var metricsApiConfig = $.extend({}, $PortalApp.Enums.ApiConfig.RefreshToken);
                    metricsApiConfig.suffixUrl += '?refreshToken='+userToken.refreshToken;
                    metricsApiConfig.data = userToken.refreshToken;
                    var deferred = $q.defer();
                    APIAccessLayer.callApi(metricsApiConfig).then(function (data) {
                        if (data.IsErrorResponse) {
                            alert(data.Errors.join());
                            $location.path("/login");
                            return false;
                        }
                        AuthService.authenticateUser(data.Response);
                        APIAccessLayer.callApi(apiConfig).then(function (returnData) {
                            deferred.resolve(returnData);
                        });
                    });
                    return deferred.promise;
                default:
                    AuthService.logout();
                    $location.path("/login");
                    return false;
            }
        }
        return false;
    };

    this.login = function (user) {
        var metricsApiConfig = $.extend({}, $PortalApp.Enums.ApiConfig.UserLogin);
        metricsApiConfig.data = user;
        return APIAccessLayer.callApi(metricsApiConfig);
    };

    this.confirmAccount = function (jsonData) {
        var metricsApiConfig = $.extend({}, $PortalApp.Enums.ApiConfig.ConfirmAccount);
        metricsApiConfig.data = jsonData;
        return APIAccessLayer.callApi(metricsApiConfig);
    };

    this.registerUser = function (jsonData) {
        var metricsApiConfig = $.extend({}, $PortalApp.Enums.ApiConfig.RegisterUser);
        metricsApiConfig.data = jsonData;
        return APIAccessLayer.callApi(metricsApiConfig);
    };

    this.GetSearchPatients = function (jsonData) {
        var metricsApiConfig = $.extend({}, $PortalApp.Enums.ApiConfig.GetSearchPatients);
        metricsApiConfig.data = jsonData;
        return APIAccessLayer.callApiWithValidToken(metricsApiConfig);
    };
});

