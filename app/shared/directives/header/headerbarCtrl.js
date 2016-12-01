export default function headerbarCtrl($state, authService) {
    const vm = this;
    
    vm.isLoggedIn = authService.isLoggedIn();

    vm.currentUser = authService.currentUser();

    vm.logout = function() {
        authService.logout();
        $state.go('login ');
    };

}
