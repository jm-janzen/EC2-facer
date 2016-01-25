'use strict';

var http = require('http')
  , fs   = require('fs')
  , log = console.log
  , PORT = 6060;

fs.readFile('./views/index.html', function (error, html) {
	if (error) throw error;
	
	http.createServer(function (req, res) {
		log('[%s]\n\tMethod: %s,\n\tURI:    %s,\n\tIP:     %s', 
			new Date(), 
			req.method, 
			req.url, 
			req.connection.remoteAddress);
		res.writeHeader(200, {'Content-Type' : 'text/html' });
		res.write(html);
		res.end();
	}).listen(PORT, function () {
		log('server listening on port', PORT);
	});
});

