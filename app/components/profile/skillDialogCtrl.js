export default function ($scope, $mdDialog, skills, savedSkills, isEdit) {
    if (skills.length > 0) {
        $scope.skills = skills;
    } else {
        $scope.skills = [{
            skill: '',
            rating: 0,
        }];
    }

    $scope.master = {};
    $scope.master = angular.copy($scope.skills);

    $scope.addSkill = function () {
        $scope.skill = '';
        $scope.rating = 0;
        if ($scope.skills) {
            $scope.skills.push({
                skill: $scope.skill,
                rating: $scope.rating,
            });
        } else {
            $scope.skills = {
                skill: $scope.skill,
                rating: $scope.rating,
            };
        }
    };

    $scope.checkDuplicate = function (index) {
        var val = $scope.skills[index].skill;
        // $scope.skillForm[`skill${index}`].$setValidity('unique', true);
        if (val !== 'undefined') {
            var sorted, i;

            sorted = $scope.skills.concat().sort(function (a, b) {
                if (a.skill === b.skill) return 0;
                return 1;
            });
            for (i = 0; i < $scope.skills.length; i++) {
                var isDuplicate = ((sorted[i - 1] && sorted[i - 1].skill === sorted[i].skill) || (sorted[i + 1] && sorted[i + 1].skill === sorted[i].skill));
                $scope.skillForm[`skill${i}`].$setValidity('unique', !isDuplicate);
            }

            // $scope.skills.forEach(function (e, i) {
            //     if (i !== index && e.skill === val) {
            //         console.log('hi');
            //         $scope.skillForm[`skill${index}`].$setValidity('unique', false);
            //     }
            // });
            if (isEdit === false) {
                savedSkills.forEach(function (e) {
                    if (e.skill === val) {
                        console.log('hello');
                        $scope.skillForm[`skill${index}`].$setValidity('unique', false);
                    }
                });
            }
        }
    };

    $scope.onSubmit = function () {
        $mdDialog.hide($scope.skills);
    };
    $scope.deleteSkill = function (index) {
        $scope.skills.splice(index, 1);
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function (form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.skills = angular.copy($scope.master);
        $mdDialog.cancel($scope.skills);
    };
}
