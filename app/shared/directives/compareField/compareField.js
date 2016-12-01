import compareLink from './compareLink';

const compareField = function () {
    return {
        require: 'ngModel',
        scope: {
            reference: '=compareField',
        },
        link: compareLink,
    };
};

export default compareField;