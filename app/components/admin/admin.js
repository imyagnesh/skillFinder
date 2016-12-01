import DialogController from './DialogController';
import ListBottomSheetCtrl from './ListBottomSheetCtrl';
import _ from 'lodash';

export default function($mdBottomSheet, $mdSidenav, $mdDialog, $state, $q, authService, profileService) {
    var vm = this;
    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;

    vm.selected = [];
    vm.tags = [];
    vm.filterSelected = true;
    vm.readonly = false;

    vm.advanceSearch = {
        employees: [],
        designations: [],
        managers: [],
        skills: [],
    }

    profileService.getAllProfiles()
        .success(function(data) {
            if (data)
                vm.profiles = data;
        })
        .error(function(e) {
            console.log(e);
        });

    profileService.getAllSkill()
        .success(function(data) {
            if (data) {
                vm.skills = data;
            }
        })
        .error(function(e) {
            console.log(e);
        });

    // Toolbar search toggle
    vm.toggleSearch = function(element) {
        vm.showSearch = !vm.showSearch;
    };

    // Sidenav toggle
    vm.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

    vm.searchProfile = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
        profileService.getProfilesBySkills(list)
            .success(function(data) {
                console.log(data);
                if (data)
                    vm.profiles = data;
            })
            .error(function(e) {
                console.log(e);
            });
    }

    vm.search = function() {
        // var data = JSON.stringify(vm.advanceSearch);
        // var query = JSON.parse(data);
        // var arr = _.map(query.employees, 'name');
        // console.log(query.employees);
        // console.log(arr);
        profileService.getAllProfiles(vm.advanceSearch)
            .success(function(data) {
                      console.log(data);
                if (data)
                    vm.profiles = data;
            })
            .error(function(e) {
                console.log(e);
            });
    }

    vm.logout = function() {
        authService.logout();
        $state.go('login');
    }


    vm.showAdd = function(ev) {
        $mdDialog.show({
                controller: ['$scope', '$mdDialog', DialogController],
                template: require('./email.html'),
                targetEvent: ev,
            })
            .then(function(answer) {
                vm.alert = 'You said the information was "' + answer + '".';
            }, function() {
                vm.alert = 'You cancelled the dialog.';
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

    vm.searchEmployees = function(criteria, role) {
        if (!pendingSearch || !debounceSearch()) {
            cancelSearch();
            return pendingSearch = $q(function(resolve, reject) {
                authService.getUsers(criteria, role)
                    .success(function(data) {
                        resolve(data);
                        refreshDebounce();
                    })
                    .error(function(error) {
                        cancelSearch = reject;
                    });
            });
        }
        return pendingSearch;
    }

    vm.skillSearch = function(criteria) {
        if (!pendingSearch || !debounceSearch()) {
            cancelSearch();
            return pendingSearch = $q(function(resolve, reject) {
                profileService.getSkills(criteria)
                    .success(function(data) {
                        resolve(data);
                        refreshDebounce();
                    })
                    .error(function(error) {
                        cancelSearch = reject;
                    });
            });
        }
        return pendingSearch;
    }
}
