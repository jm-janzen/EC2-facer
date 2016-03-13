'use strict';

var fs = require('fs');

fs.readdir('views/notes', function (error, files) {
    if (error) process.exit(1);

    var textFiles = {};
    var regex = new RegExp(/\.txt/);

    for (var file in files) {

        if (files[file].match(regex)) {
            //console.log(files[file]);
            textFiles[files[file]] = fs.readFileSync('views/notes/' + files[file], 'utf8');
        }
    }
    console.log(textFiles);
});
