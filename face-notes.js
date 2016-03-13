'use strict';

var fs = require('fs');

exports.Notes = function (path) {

    var textFiles = {};
    var regex = new RegExp(/\.txt/);

    fs.readdir('views/notes', function (error, files) {
        if (error) throw new Error("Error reading notes");

        for (var file in files) {
            if (files[file].match(regex)) {
                //console.log(files[file]);
                textFiles[files[file]] = fs.readFileSync('views/notes/' + files[file], 'utf8');
            }
        }
    });
    return textFiles;
}
