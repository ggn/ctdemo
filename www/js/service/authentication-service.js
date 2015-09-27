$PortalApp.service("AuthService", function ($http, $window) {
    var AuthenticationContext = {};

    this.logout = function () {
        $window.localStorage.clear();
        return true;
    };

    this.authenticateUser = function (token) {
        if (AuthenticationContext._supportsLocalStorage()) {
            $window.localStorage.setItem($PortalApp.Enums.Constants.USERTOKEN, token);
            return true;
        } else {
            return false;
        }
    };

    this.isAuthenticated = function () {
        var token = $window.localStorage.getItem($PortalApp.Enums.Constants.USERTOKEN);
        return token;
    };

    this.getUserDetails = function () {
        var userToken = this.isAuthenticated();
        var user =userToken;// AuthenticationContext.CreateUserFromToken(userToken.accessToken);
        return user;
    };

    this.getValidTokenName = function (token) {
        //if (AuthenticationContext.IsAccessTokenValid(token.accessToken)) {
        //    var parsedJson = AuthenticationContext._extractIdToken(token.accessToken);
        //    if (parsedJson.hasOwnProperty('exp')) {
        //        var tokenExpirytime = AuthenticationContext._getNumericDateValue(parsedJson.exp);
        //        var currentTime = new Date().getTime();
        //        var tokenRenewTime = AuthenticationContext._getNumericDateValue($PortalApp.Enums.Constants.TOKEN_RENEW_TIME_IN_SECONDS);
        //        if ((tokenExpirytime - currentTime) <= (tokenRenewTime)) {
        //            return $PortalApp.Enums.Constants.REFRESHTOKEN;
        //        }
        //    }
        //    return $PortalApp.Enums.Constants.ACCESSTOKEN;
        //}
        return $PortalApp.Enums.Constants.ACCESSTOKEN;
        //return false;
    }

    AuthenticationContext = {
        CreateUserFromToken: function (idToken) {
            {
                var user = $.extend({}, $PortalApp.Enums.Models.User);
                var parsedJson = this._extractIdToken(idToken);
                if (parsedJson && parsedJson.hasOwnProperty('aud')) {
                    user.Profile = parsedJson;
                    if (parsedJson.hasOwnProperty('upn')) {
                        user.Email = parsedJson.upn;
                    } else if (parsedJson.hasOwnProperty('email')) {
                        user.Email = parsedJson.email;
                    }
                    user.UserName = parsedJson.hasOwnProperty('given_name') ? parsedJson.given_name : "";
                    user.UserName += " " + (parsedJson.hasOwnProperty('family_name') ? parsedJson.family_name : "");
                }
                return user;
            };
        },

        IsAccessTokenValid: function (idToken) {
            var parsedJson = this._extractIdToken(idToken);
            var currentTime = new Date().getTime();
            if (parsedJson && parsedJson.hasOwnProperty('iat')) {
                if (parsedJson.hasOwnProperty('nbf') && parsedJson.hasOwnProperty('exp')) {
                    var tokenValidNotBeforetime = this._getNumericDateValue(parsedJson.nbf);
                    var tokenExpirytime = this._getNumericDateValue(parsedJson.exp);
                    if (currentTime >= tokenValidNotBeforetime && currentTime < tokenExpirytime) {
                        return true;
                    }
                }
            }
            return false;
        },

        IsRefreshTokenValid: function (expTime, tokenIssuedAt) {
            var tokenExpirytime = this._getNumericDateValue(expTime);
            var tokenIssuedtime = this._getNumericDateValue(tokenIssuedAt);
            var currentTime = new Date().getTime();
            if (currentTime > (tokenIssuedtime + tokenExpirytime)) {
                return true;
            }
            return false;
        },

        _getNumericDateValue: function (valueFromToken) {
            return valueFromToken * 1000;

        },

        _extractIdToken: function (encodedIdToken) {
            var decodedToken = this._decodeJwt(encodedIdToken);
            if (!decodedToken) {
                return null;
            }
            try {
                var base64IdToken = decodedToken.JWSPayload;
                var base64Decoded = this._base64DecodeStringUrlSafe(base64IdToken);
                if (!base64Decoded) {
                    this._logstatus('The returned id_token could not be base64 url safe decoded.');
                    return null;
                }
                return JSON.parse(base64Decoded);
            } catch (err) {
                this._logstatus('The returned id_token could not be decoded: ' + err.stack);
            }
            return null;
        },

        _decodeJwt: function (jwtToken) {
            var idTokenPartsRegex = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/;
            var matches = idTokenPartsRegex.exec(jwtToken);
            if (!matches || matches.length < 4) {
                this._logstatus('The returned id_token is not parseable.');
                return null;
            }

            var crackedToken = {
                header: matches[1],
                JWSPayload: matches[2],
                JWSSig: matches[3]
            };

            return crackedToken;
        },

        _base64DecodeStringUrlSafe: function (base64IdToken) {
            // html5 should support atob function for decoding
            base64IdToken = base64IdToken.replace(/-/g, '+').replace(/_/g, '/');
            if (window.atob) {
                return decodeURIComponent(escape(window.atob(base64IdToken))); // jshint ignore:line
            } else {
                return decodeURIComponent(escape(base64.decode(base64IdToken)));
            }
            // TODO : To add support we may call server to get token decoded
            //this._logstatus('Browser is not supported');
            //return null;
        },

        _logstatus: function (msg) {
            if (console) {
                console.log(msg);
            }
        },

        _supportsLocalStorage: function () {
            try {
                return 'localStorage' in window && window['localStorage'];
            } catch (e) {
                return false;
            }
        },
    };
});