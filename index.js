var express = require('express');
var app = express();
var morgan = require('morgan'); // logging

var port = process.env.PORT || 8080; // process.env.PORT lets the port be set by Heroku
app.set('port', port);

// Allow CORS
var cors = require('cors');
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use(morgan('dev'));
app.listen(app.get('port'), () => {
    console.log('Listening requests on port ' + port);
});

// ---------------------------------------------------------------------------------------------

var GitHubApi = require('github');
var request = require('request');
var rp = require('request-promise');
var markdown = require('markdown').markdown;
var path = require('path');
var marked = require('marked');
var Promise = require("bluebird");

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(process.cwd() + '/public'));

// use res.render to load up an ejs view file

const github = new GitHubApi({
    debug: true
});

const headMd = "> Please insert your answer between \\` and \\`.";

app.get('/CPE-CMU-26/pulls', function (req, res) {
    // res.send('You are at /github endpoint.');
    github.pullRequests.getAll({
        owner: 'tmwatchanan',
        repo: 'CPE-CMU-26',
        per_page: 100,
        page: 1,
        direction: 'asc'
    }).then(result => {
        const pullRequests = result.data;
        var pullRequestList = [];
        var ps = [];
        var readmeMdList = [];
        pullRequests.forEach(pullRequest => {
            let objPullRequest = {
                number: pullRequest.number,
                id: pullRequest.id,
                title: pullRequest.title,
                user: pullRequest.user.login,
                created_at: pullRequest.created_at,
                readme_link: req.get('host') + '/CPE-CMU-26/readme/' + pullRequest.user.login
            };
            // ps.push(rp('https://raw.githubusercontent.com/' + objPullRequest.user + '/CPE-CMU-26/master/README.md'));
            // rp('https://raw.githubusercontent.com/' + objPullRequest.user + '/CPE-CMU-26/master/README.md')
            //     .then(function (htmlString) {
            //         let answerMd = htmlString.substring(htmlString.lastIndexOf(headMd) + headMd.length, htmlString.indexOf("---\n"));
            //         objPullRequest.readme_md = marked(answerMd);
            //     });
            pullRequestList.push(objPullRequest);
            // console.log(objPullRequest);
        });
        // After loop
        // ps = ps.map((promise) => promise.reflect());

        // Promise.all(ps)
        //     .each(pInspection => {
        //         if (pInspection.isFulfilled()) {
        //             readmeMdList.push(pInspection.value())
        //         } else {
        //             console.log(pInspection.reason());
        //         }
        //     })
        //     .then(() => callback(readmeMdList)); // Or however you want to proceed

        // return res.send(pullRequestList);
        res.render('cpe-cmu-26-pulls', {
            pullRequestList: pullRequestList
        });
    });
});

app.get('/CPE-CMU-26/readme/:user', function (req, res) {

    request('https://raw.githubusercontent.com/' + req.params.user  + '/CPE-CMU-26/master/README.md', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        // return res.send(body);
        // res.send(markdown.toHTML(body));

        let answerMd = body.substring(body.lastIndexOf(headMd) + headMd.length, body.indexOf("---\n"));


        res.render('index', { // passing params
            readme_md: marked(answerMd)
        });
    });

    // github.repos.get({
    //     owner: 'peerapas',
    //     repo: 'CPE-CMU-26'
    // })
    // .then(result => {
    //     return res.send(result);
    // });
});