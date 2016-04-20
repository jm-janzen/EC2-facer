'use strict';

var http    = require('http')
  , fs      = require('fs')
  , PORT    = 6060
  , express = require('express')
  , app     = express()
  , util    = require('util');

/*
 * use ejs to serve static files
 */
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/views'));

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
    , /^\/favicon\.ico$/
    , /^\/body\/[a-z]+$/
    , /^\/robots\.txt$/
    , /^\/getGitLog$/
    , /^\/comp74\/[a-zA-z0-9]/
    , /^\/notes\/[a-zA-Z]*$/
    , /^\/scripts\/[a-zA-Z]*$/
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
 * XXX COMP74-branch related
 */

var gq = require('./gq/gq.js');

app.get('/comp74', function (req, res, next) {
    res.render('comp74.ejs', {
        subject: 'COMP74 - Github API',
    });
    logConnection(req);
});

app.get('/comp74/:shell', function (req, res, next) {
    var shell = req.params.shell;

    try {
        gq.topRuncoms(shell, function (data) {
            /*XXX*/console.log('Client received data!', data);
            var status = data.error ? 404 : 200;
            res.status(status).json(data);
        });
    } catch (error) {
        console.log('gq module threw an error "%s"!', error);
        res.status(400).end(error.toString());
    }
    logConnection(req);
});

/*
 * HTTP request routers
 */
app.all('/*', function (req, res, next) {
    res.setHeader('X-Powered-By', 'Maisy');
    if (validConnection(req.path)) {
        // TODO put this in validConnection
        if (req.method !== 'GET') {
            res.end('403');
        } else {
            next();
        }
    } else {
        console.error('Invalid path "%s"', req.path);
        // TODO add proper 404 page
        res.end('404');
    }
    logConnection(req); // TODO log fact of bad conn attempt

});

app.get('/', function (req, res, next) {
	res.render('index.ejs', {
        debug: false,
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

    console.log(req.path);

    var now = new Date();
    var info = util.format('[%s (%s)]:\t%s,\t%s,\t%s',
      now.toDateString(), now.toLocaleTimeString(),  req.method, req.ip, req.path);
    info += '\n';
    fs.appendFile('logs/connect.log', info, function (error) {
        if (error) throw new Error(("Error writing to file: " + error));
    });
    if (typeof req.path === 'undefined') {
        console.error('undefined ip', req.route);
    }
}
