$PortalApp.controller('testcontroller', function ($scope, $http) {

    showCalibratedAngle = function (acceleration) {
        $('#alphaValue').html(acceleration.x);
        $('#leftValue').html(acceleration.y);
        $('#rightValue').html(acceleration.z);
        $('#calibration').html(acceleration.timestamp);
    };


    
    $scope.onSuccess = function(acceleration) {
        alert(acceleration);
        showCalibratedAngle(acceleration);
    }

    // onError: Failed to get the acceleration
    $scope.onError= function(err) {
        alert(err);
    }

    $scope.init = function () {
        document.addEventListener("deviceready", function (event) {
            var sensorAcc = navigator.accelerometer.watchAcceleration($scope.onSuccess, $scope.onError);
            alert(sensorAcc);
        }, true);

        window.addEventListener('deviceorientation', function (event) {
            $('#alphaValue').html(event.x);
            $('#leftValue').html(event.y);
            $('#rightValue').html(event.z);
        });
    }
});