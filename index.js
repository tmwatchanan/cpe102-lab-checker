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

const github = new GitHubApi({
    debug: true
});

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
        return res.send(pullRequests);
        var pullRequestList = [];
        pullRequests.forEach(pullRequest => {
            let objPullRequest = {
                number: pullRequest.number,
                id: pullRequest.id,
                title: pullRequest.title,
                user: pullRequest.user.login,
                created_at: pullRequest.created_at
            };
            pullRequestList.push(objPullRequest);
        });
        return res.send(pullRequestList);
    });

    // github.repos.getContent({
    //     owner: 'tmwatchanan',
    //     repo: 'CPE-CMU-26',
    //     path: 'README.md'
    //     // per_page: 100,
    //     // page: 1
    // }).then(result => {
    //     return res.send(result);
    // })
    // }).then(result => {
    //     const pullRequests = result.data;
    //     var pullRequestList = [];
    //     pullRequests.forEach(pullRequest => {
    //         // let objPullRequest = {
    //         //     number: pullRequest.number,
    //         //     title: pullRequest.title,
    //         //     user: pullRequests.user.login,
    //         //     created_at: pullRequests.created_at,

    //         // };
    //     });
    //     return res.send(pullRequests);
    // });
});

app.get('/CPE-CMU-26/files', function (req, res) {

    request('https://raw.githubusercontent.com/peerapas/CPE-CMU-26/master/README.md', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        return res.send(body);
    });

    // github.repos.get({
    //     owner: 'peerapas',
    //     repo: 'CPE-CMU-26'
    // })
    // .then(result => {
    //     return res.send(result);
    // });
});