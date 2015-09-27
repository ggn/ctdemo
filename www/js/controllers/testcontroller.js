$PortalApp.controller('testcontroller', function ($scope, $http) {

    showCalibratedAngle = function (acceleration) {
        $('#alphaValue').html(acceleration.x);
        $('#leftValue').html(acceleration.y);
        $('#rightValue').html(acceleration.z);
        $('#calibration').html(acceleration.timestamp);
    };


    
    function onDeviceReady() {
        var sensorAcc = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
        alert(sensorAcc);
    }

    function onSuccess(acceleration) {
        alert(acceleration);
        showCalibratedAngle(acceleration);
    }

    // onError: Failed to get the acceleration
    function onError(err) {
        alert(err);
    }

    $scope.init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        window.addEventListener('deviceorientation', function (event) {
            $('#alphaValue').html(event.x);
            $('#leftValue').html(event.y);
            $('#rightValue').html(event.z);
        });
    }
});