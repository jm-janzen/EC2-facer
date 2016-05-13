var express = require('express');
var app     = express();

var nullportal = {

    setup: function () {
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        app.use(express.static(__dirname + '/views'));
        console.log('[nullportal]:\tSetup Complete');
    },
    hello: function (req, callback) {

        /*XXX*/console.log('[nullportal]:\t%j', req.headers);

        callback('<h1>Welcome to Nullportal</h1><p>A bit spartan right now...');

    }
};

module.exports = nullportal;
