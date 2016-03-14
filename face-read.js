'use strict';

var fs = require('fs');

/*
 * read *.txt files at given `path',
 * return array of files and their
 * textual content
 */
exports.read = function (path, type) {

    var textFiles = {};
    var regex = new RegExp("\\." + type);

    fs.readdir(path, function (error, files) {
        if (error) throw new Error("Error reading from path: " + path);

        for (var file in files) {
            if (files[file].match(regex)) {
                textFiles[files[file]] = fs.readFileSync(path
                  + '/'
                  + files[file]
                  , 'utf8');
            }
        }
    });
    return textFiles;
}
