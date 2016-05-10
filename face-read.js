'use strict';

var fs = require('fs');

/*
 * read *.<{ extension: '<type>'}> files at given `path',
 * return array of files and their
 * textual content
 * OR:
 *  if 'stats' specified in opts,
 *  just return information on the
 *  these files
 */
exports.read = function (path, callback, opts) {

    var textFiles = {};
    var options   = checkOptions(opts);
    var type      = options.extension;

    // TODO check '.gitignore' for ignored files, if no parm
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
                if (options.stats) {
                  textFiles[files[file]
                    .slice(0, typeLen)] = fs.lstatSync(path
                      + '/'
                      + files[file]);
                }
            }
        }
        if (typeof callback === 'function') {
            callback(textFiles);
        }
    });

    /*
     * presently only checks for file extension option
     *  TODO add capability of parsing more options
     */
    function checkOptions(opts) {

        var options = {};

        if (typeof opts === 'object') { // parse opts for recognized options
            for (var o in opts) {
                switch (o) {
                    case 'extension':
                        options.extension = String(opts[o]);
                        break;
                    case 'stats':
                        options.stats = true;
                        break;
                }
            }
        } else { // load with defaults
            options.extension = 'txt';
        }
        return options;
    }
}
