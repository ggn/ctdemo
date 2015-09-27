$PortalApp.Enums = {};

$PortalApp.Enums.Environment = {
    //'PortalAPIBaseUrl': 'https://mcportalservice.cloudapp.net/'
    'PortalAPIBaseUrl': 'http://localhost:64532/'
};

$PortalApp.Enums.ApiConfig = {
    'UserLogin': {
        suffixUrl: 'api/identity/login',
        type: 'POST',
        dataType: 'JSON',
        data: {},
    },
    'ConfirmAccount': {
        suffixUrl: 'api/identity/confirmAccount',
        type: 'POST',
        dataType: 'JSON',
        data: {},
    },
    'RegisterUser': {
        suffixUrl: 'api/identity/register',
        type: 'POST',
        dataType: 'JSON',
        data: {},
    },
    'Logout': {
        suffixUrl: 'api/identity/signout',
        type: 'POST',
        dataType: 'JSON',
        data: {},
    },
    'RefreshToken': {
        suffixUrl: 'api/identity/RefreshToken',
        type: 'POST',
        dataType: 'JSON',
        data: {},
    },
    'GetSearchPatients': {
        suffixUrl: 'api/SearchPatient/GetSearchPatients',
        type: 'POST',
        dataType: 'JSON',
        data: {},
    }
};

$PortalApp.Enums.PortalConfig = {
    'EmailRegex': /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,100}$/,
    'PasswordRegex': ""
};

$PortalApp.Enums.MaxlengthConfig = {
    'CompanyName': 100,
    'FirstName': 100,
    'LastName': 100,
};

$PortalApp.Enums.DashboardPartialUrls = {
    'baseurl': 'Views/Dashboard/partials/',
    'dashboard': 'dashboard.html',
    'addApplication': 'addApplication.html',
};


$PortalApp.Enums.Models = {
    'UserToken': {
        'accessToken': '',
        'refreshToken': '',
        'refreshTokenexpiresIn': '',
    },
    'User': {
        'UserName': '',
        'Email': '',
        'Profile': '',
    },
};

$PortalApp.Enums.Constants = {
    'USERTOKEN': 'userToken',
    'REFRESHTOKEN': 'refreshToken',
    'TOKEN_RENEW_TIME_IN_SECONDS': 30000000000,
    'REFRESH_TOKEN_PARAMETER': 'refreshToken',
}

