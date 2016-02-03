'use strict';

/* TODO
 *   write log module to write and print
 *   add countdown timer
 */
var http    = require('http')
  , fs      = require('fs')
  , log     = console.log
  , PORT    = 6060
  , express = require('express')
  , app     = express()
  , util    = require('util');

/*
 * use ejs to serve static files
 */
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/'));

/*
 * HTTP request routers
 */
app.get('/', function (req, res, next) {
    logConnection(req);
    next();
}, function (req, res, next) {
	res.render('index.ejs', {
        focus: 'HOME'
    });
});
app.get('/projects', function (req, res, next) {
    logConnection(req);
    next();
}, function (req, res, next) {
	res.render('projects.ejs', {
        focus: 'PROJECTS'
    });
});
app.get('/about', function (req, res, next) {
    logConnection(req);
    next();
}, function (req, res, next) {
	res.render('about.ejs', {
        focus: 'ABOUT'
    });
});
app.get('/contact', function (req, res, next) {
    logConnection(req);
    next();
}, function (req, res, next) {
	res.render('contact.ejs', {
        focus: 'CONTACT'
    });
});

/*
 * listen on port 6060 (rerouted from 80)
 */
app.listen(PORT, function () {
	console.log('facer listening on port', PORT);
});

function logConnection(req) {
    var info = util.format('[%s]: %s,\t%s,\t%s',
      new Date(), req.method, req.ip, req.path);
    info += '\n';
    fs.appendFile('logs/connect.log', info, function (error) {
        if (error) throw new Error(("Error writing to file: " + error));
    });
}

/*
 * restart server on file change
 */
var forever = require('forever-monitor');
var child = new (forever.Monitor)('facer.js', {
	max: 3,
	silent: true,
	args: []
});
child.on('exit', function () {
	log('server.js has exited after 3 restart');
}).on('watch:restart', function (info) {
	log('restarting server because "%s" changed', info.file);
}).on('restart', function () {
	log('restarting server for %s time', child.times);
});

