export default function($scope, $mdDialog) {
    $scope.to = [{
        name: 'Yagnesh Modh',
        email: 'yagnesh.modh@gmail.com',
        image: 'http://lorempixel.com/50/50/people?1'
    }];
    $scope.cc = [{
        name: 'Yagnesh Modh',
        email: 'yagnesh.modh@gmail.com',
        image: 'http://lorempixel.com/50/50/people?1'
    }];
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
