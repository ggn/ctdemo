$PortalApp.service("ValidateService", function ($http, $window, $q) {
    this.isRequired = function (scope,feild) {
        return ((scope.form[feild].$dirty || scope.submitted) && scope.form[feild].$error.required)
    };

    this.isEmail = function (scope, feild) {
        return ((scope.form[feild].$dirty || scope.submitted) && scope.form[feild].$error.pattern)
    };

    this.isNumeric = function (scope, feild) {
        return ((scope.submitted || scope.form[feild].$dirty) && scope.form[feild].$error.number)
    };
});