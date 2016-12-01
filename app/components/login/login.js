export default function ($state, authService) {
  const vm = this;

  vm.onSubmit = function () {
    authService
      .login(vm.user)
      .error(function (err) {
        alert(err.message);
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

  vm.register = function () {
    $state.go('register');
  };
}


