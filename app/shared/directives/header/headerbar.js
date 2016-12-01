import headerbarCtrl from './headerbarCtrl';

const headerbar = function() {
    return {
        restrict: 'EA',
        template: require('./headerbar.html'),
        controllerAs: 'vm',
        controller: ['$state', 'authService', headerbarCtrl],
    };
};

export default headerbar;