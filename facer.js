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

var notes = require('./face-read.js').Notes('./views/notes');

/*
 * HTTP request routers
 */
app.all('/*', function (req, res, next) {
    logConnection(req);
    next();
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
    console.log(which);
    var which = req.params.which;
    res.render(notes[which] || null);
});

/*
 * listen on port 6060 (rerouted from 80)
 */
app.listen(PORT, function () {
	console.log('facer listening on port', PORT);
});

function logConnection(req) {
    // if not my public IP
    console.log(req.path);
    if (req.ip !== '67.193.120.178') {
        var info = util.format('[%s]: %s,\t%s,\t%s',
          new Date().toUTCString(), req.method, req.ip, req.path);
        info += '\n';
        fs.appendFile('logs/connect.log', info, function (error) {
            if (error) throw new Error(("Error writing to file: " + error));
        });
    }
}
