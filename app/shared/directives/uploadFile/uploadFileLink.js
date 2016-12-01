var Docxtemplater = require('docxtemplater');
var mammoth = require("mammoth");
var $ = require("jquery");
// var docx2html = require('docx2html');

export default function uploadFileLink(scope, elem, attrs) {
    // var model = $parse(attrs.fileModel);
    // var modelSetter = model.assign;
    var button = elem.find('button');
    var input = angular.element(elem[0].querySelector('input#fileInput'));
    button.bind('click', function() {
        input[0].click();
    });
    input.bind('change', function(e) {
        // scope.$apply(function() {
            var files = e.target.files;
            if (files[0]) {
                var reader = new FileReader();
                var skills = [];
                reader.onload = function(readerEvt) {
                    var content = readerEvt.target.result;

                    mammoth.convertToHtml({
                            arrayBuffer: content
                        })
                        .then(function(result) {
                            var htmlString = result.value; // The generated HTML
                            var parsed = $('<div/>').append(htmlString);
                            var txt = parsed.find("p:contains('Technical Skills')").first().next().text();
                            var arr = txt.split(',');

                            arr.forEach(function(e) {
                                skills.push({
                                    skill: e,
                                    rating: 0,
                                });
                            });
                            scope.skills = skills;
                            scope.$apply();
                        })
                        .done();
                };

                reader.readAsArrayBuffer(files[0]);


                scope.file = files[0];
                scope.fileName = files[0].name;
                // scope.$apply();
            } else {
                scope.fileName = null;
            }
            scope.$apply();
        // });
    });

}
