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
  , app     = express();

/*
 * use ejs to serve static files
 */
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/views'));

/*
 * HTTP request routers
 */
app.get('/', function (req, res) {
	res.render('index.html');
});

/*
 * listen on port 6060 (rerouted from 80)
 */
app.listen(PORT, function () {
	console.log('facer listening on port', PORT);
});

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
});
child.on('watch:restart', function (info) {
	log('restarting server because "%s" changed', info.file);
});
child.on('restart', function () {
	log('restarting server for %s time', child.times);
});

