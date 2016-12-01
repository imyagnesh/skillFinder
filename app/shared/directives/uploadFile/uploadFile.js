import uploadFileLink from './uploadFileLink';

const headerbar = function () {
    return {
        restrict: 'EA',
        scope: {
            'file': '=',
            'skills': '=',
        },
        template: require('./uploadFile.html'),
        link: uploadFileLink,
    };
};

export default headerbar;
