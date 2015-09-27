$PortalApp.controller('ctdemocontroller', function ($scope, $interval) {
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
    $scope.dot = {
        diameter: 100,
        x: 125,
        y: 300,
        r: 255,
        g: 255,
        b: 255,
        flicker:250,
        style: {}
    };

    $scope.init = function () {
        $scope.controlPanelClicked = false;
        $scope.calcStyle($scope.dot);
        setFlickerer($scope.dot);
    };

    $scope.calcStyle = function (dot) {
        dot.style = { 'width': dot.diameter + 'px', 'height': dot.diameter + 'px', 'top': dot.y + 'px', 'left': dot.x + 'px', 'background': 'rgb(' + dot.r + ',' + dot.g + ',' + dot.b + ')' };
    };
    $scope.style = function (dot) {
        return dot.style;
    };

    $scope.stopFlickler = function (dot) {
        $scope.controlPanelClicked = $scope.controlPanelClicked ? false : true;
        if (!$scope.controlPanelClicked) {
            setFlickerer(dot);
        } else {
            clearFlickerer();
            $scope.dot.r = $scope.dot.b = $scope.dot.g = 255;
        };
        $scope.calcStyle($scope.dot);
    };
});


