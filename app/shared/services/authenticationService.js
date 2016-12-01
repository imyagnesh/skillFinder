import angular from 'angular';


function Service($http, $window) {


    function saveToken(token) {
        $window.localStorage['mean-token'] = token;
    }

    function getToken() {
        return $window.localStorage['mean-token'];
    }

    function isLoggedIn() {
        const token = getToken();
        let payload;

        if (token) {
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    function currentUser() {
        if (!isLoggedIn()) return;

        const token = getToken();
        let payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
            _id: payload._id,
            email: payload.email,
            name: payload.name,
            role: payload.role,
        };
    }

    function register(user) {
        return $http.post('/api/register', user).success(function(data) {
            saveToken(data.token);
        }).error(function(err) {
            return err.message;
        });
    }

    function login(user) {
        return $http.post('/api/login', user).success(function(data) {
            saveToken(data.token);
        }).error(function(err) {
            return err.message;
        });
    }

    function logout() {
        $window.localStorage.removeItem('mean-token');
    }

    function getUsers(query, role) {
        return $http.get(`/api/getUsers/${query}/${role}`, {
            headers: {
                Authorization: 'Bearer ' + getToken(),
            },
        });
    }

    const service = {
        currentUser,
        saveToken,
        getToken,
        isLoggedIn,
        register,
        login,
        logout,
        getUsers,
    };

    return service;
}


Service.$inject = ['$http', '$window'];
const authService = angular
    .module('skillApp.authService', [])
    .factory('authService', Service);

export default authService;
