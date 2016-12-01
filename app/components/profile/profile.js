import DialogController from './skillDialogCtrl';
import _ from 'lodash';

export default function ($scope, $state, $mdDialog, $mdMedia, $q, $timeout, $window, profileService, authService) {
    let vm = this;
    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;


    vm.profile = {
        managerId: '',
        managerName: '',
        managerEmail: '',
        designation: '',
        resume: {
            fileName: '',
            resumeId: '',
        },
        resumeFile: '',
        skills: [],
    };

    vm.skills = [];

    vm.isEditSkills = false;

    $scope.$watch('vm.skills', function (nv) {
        if (nv.length > 0)
            vm.showAddSkill();
    });

    var promise = profileService.getProfile();

    promise.then(
        function (result) {
            var data = result.data;
            if (data) {
                vm.profile.managerId = data.managerId._id;
                vm.profile.managerName = data.managerId.name;
                vm.profile.managerEmail = data.managerId.email;
                vm.profile.designation = data.designation;
                vm.profile.resume = data.resume;
                vm.profile.skills = data.skills;
            }
        },
        function (error) {
            console.log(error);
        });

    function setSkills(data) {
        if (vm.isEditSkills) {
            vm.profile.skills = [];
        }
        _.forEach(data, function (value) {
            vm.profile.skills.push(value);
        });
        vm.skills = [];
        vm.isEditSkills = false;
    }


    vm.showAddSkill = function (ev) {
        $mdDialog.show({
            controller: ['$scope', '$mdDialog', 'skills', 'savedSkills', 'isEdit', DialogController],
            template: require('./showAddSkill.html'),
            targetEvent: ev,
            locals: {
                skills: vm.skills,
                savedSkills: vm.profile.skills,
                isEdit: vm.isEditSkills,
            },
        }).then(function (hideSkills) {
            setSkills(hideSkills);
        }, function (cancelSkills) {
            setSkills(cancelSkills);
        });
    };

    vm.showEditSkill = function () {
        vm.isEditSkills = true;
        vm.skills = vm.profile.skills;
    };


    vm.selectedItemChange = function (item) {
        if (typeof item === 'object') {
            vm.profile.managerId = item._id;
            vm.profile.managerEmail = item.email;
        } else if (item === undefined) {
            vm.profile.managerId = '';
            // vm.profile.managerName = '';
            vm.profile.managerEmail = '';
        }
    };

    vm.currentUser = authService.currentUser();

    vm.onSubmit = function () {
        profileService.createProfile(vm.profile)
            .success(function (data) {
                if (data)
                    vm.profile = data;
            })
            .error(function (e) {
                console.log(e);
            });
        vm.editApp = 0;
    };
    vm.deleteSkill = function (index) {
        vm.profile.skills.splice(index, 1);
    };
    vm.logout = function () {
        authService.logout();
        $state.go('login');
    };
    vm.downloadFile = function (resumeId, fileName) {
        console.log(resumeId);
        profileService.getFile(resumeId)
            .success(function (data, status, headers, config) {
                console.log(data);
                var blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                });
                var fileName = headers('content-disposition');
                saveAs(blob, fileName);
            })
            .error(function (data, status, headers, config) {
                // handle error
                console.log(data);
            });
    };

    function refreshDebounce() {
        lastSearch = 0;
        pendingSearch = null;
        cancelSearch = angular.noop;
    }

    function debounceSearch() {
        var now = new Date().getMilliseconds();
        lastSearch = lastSearch || now;
        return ((now - lastSearch) < 300);
    }

    vm.searchEmployees = function (criteria, role) {
        if (!pendingSearch || !debounceSearch()) {
            cancelSearch();
            return pendingSearch = $q(function (resolve, reject) {
                authService.getUsers(criteria, role)
                    .success(function (data) {
                        resolve(data);
                        refreshDebounce();
                    })
                    .error(function (error) {
                        cancelSearch = reject;
                    });
            });
        }
        return pendingSearch;
    };
}
