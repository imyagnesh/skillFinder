import angular from 'angular';
import _ from 'lodash';

function Service($http, authService) {

    function getProfile() {
        return $http.get('/api/profile', {
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
            },
        });
    }

    function getProfilesBySkills(skills) {
        console.log(`/api/profiles/${skills}`);
        return $http.get(`/api/profiles/${skills}`, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
            },
        });
    }

    function createProfile(user) {
      console.log(user);
        var fd = new FormData();
        _.forEach(user, function(value, key) {
            if (value) {
                if (value.constructor === Array) {
                    fd.append(key, JSON.stringify(value));
                } else {
                    fd.append(key, value);
                }
            }
        });
        return $http.post('/api/upload', fd, {
            transformRequest: angular.identity,
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
                'Content-Type': undefined,
            },
        });
    }

    function getFile(fileId) {
        return $http.post(`/api/getFile/${fileId}`, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
            },
        });
    }

    function getAllSkill() {
        return $http.get('/api/getAllSkills', {
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
            },
        });
    }

    function getAllProfiles(query) {
        var url = '/api/profiles';
        if (query) {
            url = `/api/profiles/${JSON.stringify(query)}`;
        }
        console.log(url);
        return $http.get(url, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
            },
        });
    }

    function getSkills(query) {
        return $http.get(`/api/getSkills/${query}`, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
            },
        });
    }

    function getDesignations(query) {
        return $http.get(`/api/getDesignations/${query}`, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken(),
            },
        });
    }

    const service = {
        getProfile,
        getAllProfiles,
        createProfile,
        getFile,
        getAllSkill,
        getProfilesBySkills,
        getSkills,
        getDesignations,
    };

    return service;
}


Service.$inject = ['$http', 'authService'];

const profileService = angular
    .module('skillApp.profileService', [])
    .factory('profileService', Service);

export default profileService;
