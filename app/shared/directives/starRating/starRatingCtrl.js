export default function starRatingCtrl($scope) {
    $scope.maxRatings = [];

    for (let i = 1; i <= $scope.maxRating; i++) {
        $scope.maxRatings.push({});
    };

    $scope._rating = $scope.rating;

    $scope.$watch('rating', function(nv) {
        $scope._rating = nv;
     });


    $scope.isolatedClick = function (param) {
        if ($scope.readOnly === 'true') return;

        $scope.rating = $scope._rating = param;
        $scope.hoverValue = 0;
        $scope.click({
            param,
        });
    };

    $scope.isolatedMouseHover = function (param) {
        if ($scope.readOnly === 'true') return;

        $scope._rating = 0;
        $scope.hoverValue = param;
        $scope.mouseHover({
            param,
        });
    };

    $scope.isolatedMouseLeave = function (param) {
        if ($scope.readOnly === 'true') return;

        $scope._rating = $scope.rating;
        $scope.hoverValue = 0;
        $scope.mouseLeave({
            param,
        });
    };

}
