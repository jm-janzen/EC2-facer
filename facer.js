'use strict';

var http    = require('http')
  , fs      = require('fs')
  , PORT    = 8080 // XXX dev mode
  , express = require('express')
  , app     = express()
  , util    = require('util');

var httpCodes = JSON.parse(fs.readFileSync('./views/json/http-codes.json', 'utf8'));

/*
 * Use nullportal to handle connections on
 * same such domain.
 */
var np = require('./nullportal-web/nullportal.js');
np.setup();

/*
 * use ejs to serve static files
 */
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Aliases for paths to main and sub website resources
app.use('/', express.static(__dirname + '/views'));
app.use('/nullportal-views', express.static(__dirname + '/nullportal-web/views'));

/*
 * get git log file
 * TODO seperate this into a module
 */
var gitText = {};
fs.readFile('./views/gitlog.txt', 'utf8', function (error, data) {
    if (! error) gitText = { 'content': data };
});

/*
 * read body files for later serving
 */
var bodies = {};
var subjects = {
    projects:   'Personal Projects'
    , about:    'About Me'
    , contact:  'Get in Touch'
    , home:     'Hello'
};
var files = [ 'about', 'projects', 'contact', 'home'];
for (var i = 0; i < files.length; i++) {
    bodies[files[i]] = fs.readFileSync('./views/bodies/body-' + files[i] + '.ejs', 'utf8');
}

/*
 * valid urls
 */
var valid = [ /^\/$/
    , /^\/body\/[a-z]+$/
    , /^\/favicon\.ico$/
    , /^\/getGitLog$/
    , /^\/notes\/[a-zA-Z]*$/
    , /^\/robots\.txt$/
    , /^\/scripts\/[a-zA-Z-]*$/
];

/*
 * read some submodules' files for later serving
 */
var reader  = require('./face-read.js');
var notes = {};
reader.read('./views/notes', function (result) {
    notes = result;
});
var scripts = {};
reader.read('./views/scripts', function (result) {
    scripts = result;
}, { extension: 'sh' });

/*
 * HTTP request routers
 */
app.all('/*', function (req, res, next) {
    res.setHeader('X-Powered-By', 'Maisy');
    if (validConnection(req.path)) {
        // TODO put this in validConnection
        if (req.method !== 'GET') {
            res.end('403');
        } else if (req.headers.host === 'www.nullportal.com') {
            np.getPage(req, function (result) {
                res.end(result);
            });
        } else {
            next();
        }
    } else {
        console.error('Invalid path "%s"', req.path);
        res.render('400.ejs', {
            httpStatus: httpCodes.ClientError[400]
        });
    }
    logConnection(req); // TODO log fact of bad conn attempt

});

app.get('/', function (req, res, next) {
	res.render('index.ejs', {
        debug: true,
        subject: 'Hello',
        content: bodies['home']
    });
});
app.get('/body/:which', function (req, res, next) {
    var which = req.params.which;

    res.status(200).json({
        data: {
            subject: subjects[which],
            content: bodies[which]
        }
    });
});
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send('#011000100110010101100101011100000010'
    + '00000110001001101111011011110111000000100001'
    + '\nUser-agent: *\nDisallow: /');
});
app.get('/getGitLog', function (req, res) {
    res.send(gitText);
});

app.get('/notes', function (req, res) {
    res.render('notes.ejs', {
        subject: 'Some Notes',
        titles: Object.keys(notes),
        notes: notes
    });
});
app.get('/notes/:which', function (req, res) {
    var which = req.params.which;
    res.setHeader('Content-Type', 'text/plain');
    res.send((notes[which]) || '404');
});

app.get('/scripts', function (req, res) {
    res.render('scripts.ejs', {
        subject: 'Some Scripts',
        titles: Object.keys(scripts),
        scripts: scripts
    });
});
app.get('/scripts/:which', function (req, res) {
    var which = req.params.which;
    res.setHeader('Content-Type', 'text/plain');
    res.send((scripts[which]) || '404');
});

/*
 * listen on port 6060 (rerouted from 80)
 */
app.listen(PORT, function () {
	console.log('facer listening on port', PORT);
});

function validConnection(path) {
    var result = false;
    valid.forEach(function (r) {
        if (path.match(r) !== null) {
            result = true;
        }
    });
    return result;
}

function logConnection(req) {

    console.log(req.headers.host, req.path);

    var now = new Date();
    var info = util.format('[%s (%s)]:\t%s,\t%s,\t%s%s',
      now.toDateString(), now.toLocaleTimeString(),  req.method, req.ip, req.headers.host, req.path);
    info += '\n';
    fs.appendFile('logs/connect.log', info, function (error) {
        if (error) throw new Error(("Error writing to file: " + error));
    });
    if (typeof req.path === 'undefined') {
        console.error('undefined ip', req.route);
    }
}
