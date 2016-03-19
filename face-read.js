'use strict';

var fs = require('fs');

/*
 * read *.txt files at given `path',
 * return array of files and their
 * textual content
 */
exports.read = function (path, type, callback) {

    var textFiles = {};
    var regex = new RegExp("\\." + type);

    fs.readdir(path, function (error, files) {
        if (error) throw new Error("Error reading from path: " + path);

        for (var file = 0; file < files.length; file++) {
            if (files[file].match(regex)) {
                textFiles[files[file]
                  .slice(0, (type.length * -1) - 1 )] = fs.readFileSync(path
                    + '/'
                    + files[file]
                    , 'utf8');
            }
        }
        if (typeof callback === 'function') {
            callback(textFiles);
        }
    });
}
