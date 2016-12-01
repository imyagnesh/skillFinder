export default function ($state, authService) {
    const vm = this;

    vm.user = {
        'name': '',
        'email': '',
        'password': '',
        'role': 'developer',
    };

    vm.onSubmit = function () {
        authService.register(vm.user)
            .error(function (err) {
                alert(err);
            })
            .then(function () {
                if (authService.currentUser().role === 'manager') {
                    $state.go('admin');
                }
                else {
                    $state.go('profile');
                }
            });
    };
}
