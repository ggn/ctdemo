$PortalApp.controller('innovationlabdemocontroller', function ($scope, $interval) {
    var flickerer;
    var setFlickerer = function (dot) {
        flickerer = $interval(function () {
            if (dot.r == 0) {
                $scope.dot.r = $scope.dot.b = $scope.dot.g = 255;
            } else {
                $scope.dot.r = $scope.dot.b = $scope.dot.g = 0;
            };
            $scope.calcStyle(dot);
        }, dot.flicker);
    };
    var clearFlickerer = function () {
        $interval.cancel(flickerer);
        flickerer = undefined;
    };

    $scope.init = function () {
        $scope.dot = {
            diameter: 100,
            x: 125,
            y: 300,
            r: 255,
            g: 255,
            b: 255,
            flicker: 250,
            style: {}
        };
        $scope.calcStyle($scope.dot);
        setFlickerer($scope.dot);
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    $scope.calcStyle = function (dot) {
        dot.style = {
            'width': dot.diameter + 'px',
            'height': dot.diameter + 'px',
            'top': dot.y + 'px',
            'left': dot.x + 'px',
            'background': 'rgb(' + dot.r + ',' + dot.g + ',' + dot.b + ')'
        };
    };
    $scope.style = function (dot) {
        return dot.style;
    };

    var options = {
        frequency: 80
    };

    function onDeviceReady() {
        var sensorAcc = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
        alert(sensorAcc);
    }

    // onSuccess: Get a snapshot of the current acceleration
    function onSuccess(acceleration) {
        alert(acceleration);
        $('#circle').html('Acceleration X: ' + acceleration.x + '\n' +
            'Acceleration Y: ' + acceleration.y + '\n' +
            'Acceleration Z: ' + acceleration.z + '\n' +
            'Timestamp: ' + acceleration.timestamp + '\n');
    }

    // onError: Failed to get the acceleration
    function onError(err) {
        alert(err);
        $('#circle').html('onError!');
    }
});