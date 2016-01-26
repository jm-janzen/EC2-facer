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

//fs.readFile('./views/index.html', function (error, html) {
//	if (error) throw error;
//
//	http.createServer(function (req, res) {
//		log('[%s]\n\tMethod: %s,\n\tURI:    %s,\n\tIP:     %s'
//			, new Date()
//			, req.method
//			, req.url
//			, req.connection.remoteAddress);
//		// TODO set content-type to text/css for *.css file :p
//		res.writeHeader(200, {'Content-Type' : 'text/html' });
//		res.write(html);
//		res.end();
//	}).listen(PORT, function () {
//		log('server listening on port', PORT);
//	});
//});

http.createServer(function (req, res) {
	// XXX presently breaks server
	if (req.url.indexOf('.html') != -1) {
		fs.readFile(__dirName + '/views/index.html', function (error, html) {
			if (error) log('Error loading html:', error);
			res.writeHeader(200, {'Content-Type' : 'text/html' });
			res.write(html);
			res.end();
		});
	}
	if (req.url.indexOf('.css') != -1) {
		fs.readFile(__dirName + '/views/style.css', function (error, css) {
			if (error) log('Error loading css:', error);
			res.writeHeader(200, {'Content-Type' : 'text/css' });
			res.write(html);
			res.end();
		});
	}
}).listen(PORT, function () {
	log('server listening on port', PORT);
});

