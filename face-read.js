'use strict';

var fs = require('fs');

/*
 * read *.<type> files at given `path',
 * return array of files and their
 * textual content
 */
exports.read = function (path, callback, opts) {

    var textFiles = {};
    var type = checkOptions(opts);

    var regex = new RegExp("\\." + type);
    var typeLen = (type.length * -1) -1;

    fs.readdir(path, function (error, files) {
        if (error) throw new Error("Error reading from path: " + path);

        for (var file = 0; file < files.length; file++) {
            if (files[file].match(regex)) {
                // load textFiles with content
                textFiles[files[file]
                  .slice(0, typeLen)] = fs.readFileSync(path
                    + '/'
                    + files[file]
                    , 'utf8');
            }
        }
        if (typeof callback === 'function') {
            callback(textFiles);
        }
    });

    /*
     * presently only checks for file extension option
     */
    function checkOptions(opts) {
        if (typeof opts === 'object') {
            for (var o in opts) {
                switch (o) {
                    case 'extension':
                        return String(opts[o]);
                        break;
                }
            }
        }
        return 'txt';
    }
}
