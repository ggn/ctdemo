$PortalApp.controller('innovationlabdemocontroller', function ($scope, $interval) {
    var flickerer,
        angles = {
            alpha: 0,
            leftEye: 0,
            rightEye: 0,
            calibration: 0,
            calibrated: false
        },
        testName,
        feildTestReadings = [], averageReadingsObj = [],
        showError = function (msg) {
            alert(msg);
        },
        startVibrate = function (levelValue) {
            try {
                var level = parseInt(levelValue);
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(level);
                } else {
                    if (navigator && navigator.vibrate) {
                        navigator.vibrate(level);
                    } else {
                        navigator.notification.beep(level);
                    }
                }
            } catch (e) {
                console.log(e);
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
        saveReading = function (result) {
            window.localStorage.setItem('readings', JSON.stringify(result));
        },
        calculateReading = function () {
            startVibrate(100);
            $scope.resultArrayToValidate = [];
            var calibratedAt = angles.calibrated,
                reading = angles.alpha
            ;
            var difference = 0;
            if (testName === 'left') {
                difference = reading - calibratedAt;
            } else {
                difference = calibratedAt - reading;
            }

            difference = difference < 0 ? 360 + difference : difference;

            if (!isNaN(difference)) {
                $scope.resultArrayToValidate.push({
                    test: testName == 'right' ? 'Right Eye' : 'Left Eye',
                    reading: difference,
                });
            }
            $scope.calibrated = false;
            $scope.showScreen = 'resultScreen';
        };

    $scope.startFeildTest = function (testEye) {
        testName = testEye;
        $scope.calibrated = true;
        feildTestReadings = [];
        angles.calibrated = angles.alpha;
        $scope.showScreen = 'testScreen';
    };

    $scope.saveCalculatedReading = function () {
        calculateReading();
    };

    $scope.saveValidReading = function (resultValidatedArray) {
        if (resultValidatedArray) {
            var tempReading = {
                date: GetDate(),
                test: resultValidatedArray[0].test,
                reading: resultValidatedArray[0].reading
            };

            if (resultValidatedArray.length > 0) {
                $scope.results.push(tempReading);
                saveReading($scope.results);
            }
        }
        $scope.showScreen = 'historyScreen';
        resultValidatedArray = [];
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
                angles.alpha = Math.round(event.alpha);
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
});