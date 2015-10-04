$PortalApp.controller('innovationlabdemocontroller', function ($scope, $interval) {
    var flickerer,
        angles = {
            alpha: 0,
            leftEye: 0,
            rightEye: 0,
            calibration: 0,
            calibrated: false
        },
        feildTestReadings = [], averageReadingsObj = [],
        showError = function (msg) {
            alert(msg);
        },
        startVibrate = function (level) {
            level = parseInt(level);
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(level);
            } else {
                if (navigator && navigator.vibrate) {
                    navigator.vibrate(level);
                } else {
                    navigator.notification.beep(level);
                }
            }
        },
        stopVibrate = function () {
            startVibrate(0);
        },
        setFlickerer = function (dot) {
            flickerer = $interval(function () {
                if (dot.r == 0) {
                    $scope.dot.r = $scope.dot.b = $scope.dot.g = 255;
                } else {
                    $scope.dot.r = $scope.dot.b = $scope.dot.g = 0;
                };
                $scope.calcStyle(dot);
            }, dot.flicker);
        },
        clearFlickerer = function () {
            $interval.cancel(flickerer);
            flickerer = undefined;
        },
        GetDate = function () {
            var monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dateTime = new Date();
            return (dateTime.getDate() + "-" + monthNames[dateTime.getMonth()] + "-" + dateTime.getFullYear());
        },
        getAverage = function (readings) {
            var total = 0;
            for (var i = 0; i < readings.length; i++) {
                total += readings[i];
            }
            return total / readings.length;
        },
        saveReading = function (result) {
            window.localStorage.setItem('readings', JSON.stringify(result));
        },
        calculateReading = function (tempFeildTestReadings) {
            if (tempFeildTestReadings.length > 0) {
                var calibratedAt = angles.calibrated,
                    leftEyeAngels = [],
                    rightEyeAngles = [];
                tempFeildTestReadings.forEach(function (val) {
                    var difference = calibratedAt > val ? calibratedAt - val : val - calibratedAt;

                    //averageReadingsObj
                    if (difference > 110) {
                        if (calibratedAt - val < 0) {
                            rightEyeAngles.push((360 - val) + calibratedAt);
                        } else {
                            leftEyeAngels.push((360 - calibratedAt) + val);
                        }
                    } else {
                        if (val > calibratedAt) {
                            leftEyeAngels.push(difference);
                        } else {
                            rightEyeAngles.push(difference);
                        }
                    }
                });

                var tempArray = leftEyeAngels.length > rightEyeAngles.length ? leftEyeAngels : rightEyeAngles;
                tempArray.forEach(function (val, i) {
                    $scope.resultArrayToValidate.push({
                        isLeftValid: true,
                        leftEye: leftEyeAngels[i],
                        rightEye: rightEyeAngles[i],
                        isRightValid: true
                    });
                });
                $scope.showScreen = 'resultScreen';
            }
        };

    $scope.startFeildTest = function () {
        if ($scope.calibrated) {
            $scope.calibrated = false;
            calculateReading(feildTestReadings);
        } else {
            $scope.calibrated = true;
            feildTestReadings = [];
            angles.calibrated = angles.alpha;
            $scope.showScreen = 'testScreen';
        }
    };

    $scope.saveValidReading = function (resultValidatedArray) {
        var rightEyeAngles = [], leftEyeAngels = [];
        resultValidatedArray.forEach(function (val) {
            if (val.isRightValid) {
                rightEyeAngles.push(val.rightEye);
            }
            if (val.isLeftValid) {
                leftEyeAngels.push(val.leftEye);
            }
        });

        var tempReading = {
            date: GetDate(),
            rightEye: getAverage(rightEyeAngles),
            leftEye: getAverage(leftEyeAngels)
        };

        if (resultValidatedArray) {
            $scope.results.push(tempReading);
            saveReading($scope.results);
        }
        $scope.showScreen = 'historyScreen';
    };

    $scope.init = function () {
        $scope.calibrated = false;
        $scope.results = [];
        $scope.resultArrayToValidate = [];
        $scope.showScreen = 'historyScreen';
        var tempReading = window.localStorage.getItem('readings');
        if (tempReading) {
            $scope.results = JSON.parse(tempReading);
        }
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
        var storedSetting = JSON.parse(window.localStorage.getItem('settings'));
        if (storedSetting) {
            $scope.dot = storedSetting;
        }
        $scope.calcStyle($scope.dot);
        setFlickerer($scope.dot);


        //Check for support for DeviceOrientation event
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (event) {
                var temp = Math.ceil(event.alpha);
                angles.alpha = temp - (temp % 10);
            }, false);
        } else {
            showError("Unable to get rotation data");
        }
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

    $scope.saveReading = function () {
        feildTestReadings.push(angles.alpha);
    };
});