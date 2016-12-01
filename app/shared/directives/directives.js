import headerbar from './header/headerbar';
import uploadFile from './uploadFile/uploadFile';
import compareField from './compareField/compareField';
import starRating from './starRating/starRating';

module.exports = function directives(app) {
    app.directive('headerbar', headerbar);
    app.directive('uploadFile', uploadFile);
    app.directive('compareField', compareField);
    app.directive('starRating', starRating);
};