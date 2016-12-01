import starRatingCompile from './starRatingCompile';
import starRatingCtrl from './starRatingCtrl';

const starRating = function () {
    return {
        restrict: 'EA',
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: '&',
            mouseHover: '&',
            mouseLeave: '&',
        },
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        template: require('./starRating.html'),
        controller: ['$scope', starRatingCtrl],
    };
};

export default starRating;
