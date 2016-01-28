'use strict';

/* TODO
 *   write log module to write and print
 *   add countdown timer
 *   add CSS
 *   fix missing content-type text/css
 */

var http = require('http')
  , fs   = require('fs')
  , log = console.log
  , PORT = 6060;

var express = require('express');
var app     = express();

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

http.createServer(function (req, res) {
	var dirName = fs.realpathSync('.');
	var path = req.url;
	console.log('req:', path);
	if (path.indexOf('/') != -1) {
		fs.readFile(dirName + '/views/index.html', function (error, html) {
			if (error) log('Error loading html:', error);
			res.writeHeader(200, {'Content-Type' : 'text/html' });
			res.write(html);
			res.end();
		});
	}
	if (path.indexOf('/views/style.css') != -1) {
		fs.readFile(dirName + '/views/style.css', function (error, css) {
			if (error) log('Error loading css:', error);
			res.writeHeader(200, {'Content-Type' : 'text/css' });
			res.write(css);
			res.end();
		});
	}
}).listen(PORT, function () {
	log('server listening on port', PORT);
});

