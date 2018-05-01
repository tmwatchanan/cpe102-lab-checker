var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // handling HTML body
var morgan = require('morgan'); // logging

// Lcao environment variables from a .env file -> process.env
require('dotenv').config()

var port = process.env.PORT || 5050; // process.env.PORT lets the port be set by Heroku
app.set('port', port);

// Allow CORS
var cors = require('cors');
app.use(cors({}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// use body parser so we can get info from POST and/or URL params
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.listen(app.get('port'), () => {
    console.log('Listening requests on port ' + port);
});

// ---------------------------------------------------------------------------------------------
var mongoose = require('mongoose');
var mongoDB = 'mongodb://' + process.env.mLabCpe102User + ':' + process.env.mLabCpe102Password + '@ds113648.mlab.com:13648/cpe102-2560-2';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// ---------------------------------------------------------------------------------------------

// Webhook--------------------------------------------------------------------------------------
// var githubhook = require('githubhook');
// var github = githubhook({/* options */});
// github.listen();
// github.on('repository:created', function (event, data) {
// });

// ---------------------------------------------------------------------------------------------


var GitHubApi = require('github');
var request = require('request');
var path = require('path');
var marked = require('marked');

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
            pullRequestList.push(objPullRequest);
        });
        // return res.send(pullRequestList);
        res.render('cpe-cmu-26-pulls', {
            pullRequestList: pullRequestList
        });
    });
});

app.get('/CPE-CMU-26/readme/:user', function (req, res) {

    request('https://raw.githubusercontent.com/' + req.params.user + '/CPE-CMU-26/master/README.md', function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        // return res.send(body);
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

app.get('/cpe102-2560-2', function (req, res) {
    // res.send('You are at /github endpoint.');
    // user token
    github.authenticate({
        type: 'token',
        token: process.env.githubToken
    });
    github.repos.getForOrg({
        org: 'cpe102-2560-2',
        type: 'private'
    }).then(result => {
        res.send(result);
    });
});

app.get('/cpe102-2560-2/mu', function (req, res) {
    github.authenticate({
        type: 'token',
        token: process.env.githubToken
    });
    github.repos.getContent({
        owner: 'cpe102-2560-2',
        repo: 'hw0-introduce-youtself-MisterMu',
        path: 'MyNameIs.md'
    }).then(result => {
        res.send(result);
    });
    // github.repos.getById({
    //     id: '115521809'
    // }).then(result => {
    //     res.send(result);
    // });
});

app.get('/cpe102-2560-2/add-students', function (req, res) {
    const studentUsernameList = ["chawitW", "guylaxy31", "p39149845", "jackthep", "spc009", "magnet327", "TouchySarun", "natchap0n", "macropusgiganteus", "greede14", "petpusin", "armarnan12@hotmail.com", "armarnan12", "Mindji", "mickche1996", "admirerate", "job25721", "Elevator", "Annopktz", "Chayootpong", "Jinojanashi", "ghinida", "ananaum", "peerapas", "KanapongP", "poom12345p", "tomta555", "tungkraiwit", "Pleumrunner", "forceframe", "Dream2382", "600610721", "wavewcy", "ekawitjaidee", "AphisitKh", "pchunya", "darapassara", "Bright2542za", "natchapon12", "Lydiawm", "m4nucho", "Ganicknan", "vachi772", "Lydiawimoo", "thanaphon0737", "phumthai", "sasirat", "apisaraT", "praewpsl", "hutchiw", "HeyzzWatcharin", "knightg1000", "attakorn0798", "songcramlok", "jnpat", "arpologize", "natapong87", "mangocpe1196", "pattadonnutes", "noratap09", "khaohoms97", "phanthakan0759", "Gamecup", "supakonzz", "Thipaporn", "Tiewly", "Acexakino", "Krisanawan19", "Nutchapun", "Rattatammanoon", "Sirin0786", "Boomlnwza0799", "st203g1", "teerapatpor", "thutgtz", "AoFNontawat", "notkakmak", "TimingKidz", "Faikavi", "Flukkyeieizaa", "zenoice", "Nuttakun", "BestPucharapol", "kawinupra", "ravichahashi", "foxxeses23", "midoriz", "kiujkio", "bombbae1234", "600610794", "PondPang", "Whaleb", "mrkwskiti", "Tontae", "PacharaBu", "terkzayo", "KotoriSN", "Pattadon ", "teamhd35975", "pakhatai"];

    github.authenticate({
        type: 'token',
        token: process.env.githubToken
    });

    var resultList = [];
    studentUsernameList.forEach(studentUsername => {
        github.orgs.addOrgMembership({
            org: 'cpe102-2560-2',
            username: studentUsername,
            role: 'member'
        }).then(result => {
            // console.log(result);
            const resultObject = {
                username: result.data.user.login,
                state: result.data.state,
                org: result.data.organization.login
            }
            const resultString = resultObject.username + " has been invited to " + resultObject.org + ". [" + resultObject.state + "]";
            console.log(resultString);
            resultList.push(resultString);
        });
    });
    return res.send({ resultList });
});

// ---------------------------------------------------------------------------------------------
app.get('/cpe102-2560-2/pe1-trigger-builds', function (req, res) {
    github.authenticate({
        type: 'token',
        token: process.env.githubToken
    });
    github.repos.getForOrg({
        org: "cpe102-2560-2",
        type: "private",
        per_page: 100,
        page: 4
    }).then(repoList => {
        var selectedRepoList = [];
        // console.log(repoList.data);
        // return res.json(repoList.data);
        for (i in repoList.data) {
            let repoName = repoList.data[i].name;
            if (repoName.indexOf("pe") != -1) {
                selectedRepoList.push(repoName);
            }
        }
        // repoList.forEach(repo => {
        //     if (repo.name.contains("pe")) {
        //         selectedRepoList.push(repo.name);
        //     }
        // });
        return res.json(selectedRepoList);
    });
});
// ---------------------------------------------------------------------------------------------

var mainController = require('./controllers/mainController');

app.post('/cpe102-2560-2/exam-i', function (req, res) {
    console.log("[ID:" + req.body.id + "] submitted with token " + req.body.token);
    mainController.gotPE1Result(req, res);
    return res.json({
        server: "OK"
    });
});

app.get('/cpe102-2560-2/practical-exam-1-check', function (req, res) {
    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    console.log("[IP:" + ip + "] watched /cpe102-2560-2/practical-exam-1-check endpoint");
    mainController.showPracticalExam1CheckFromDatabase(req, res);
});

app.get('/cpe102-2560-2/practical-exam-1-repos', function (req, res) {
    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    console.log("[IP:" + ip + "] watched /cpe102-2560-2/practical-exam-1-repos endpoint");
    mainController.showPracticalExam1CheckFromGitHub(req, res);
});

app.post('/cpe102-2560-2/lab6/submit', function (req, res) {
    console.log("[username:" + req.body.username + "] submitted repo " + req.body.repo);
    mainController.lab6Submit(req, res);
    return res.json({
        server: "OK"
    });
});

app.get('/cpe102-2560-2/lab-6-check', function (req, res) {
    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    console.log("[IP:" + ip + "] watched /cpe102-2560-2/lab-6-check endpoint");
    mainController.showLab6Check(req, res);
});

app.post('/cpe102-2560-2/lab11/submit', function (req, res) {
    console.log("[username:" + req.body.username + "] submitted repo " + req.body.repo);
    mainController.lab11Submit(req, res);
    return res.json({
        server: "OK"
    });
});

app.get('/cpe102-2560-2/lab-11-check', function (req, res) {
    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    console.log("[IP:" + ip + "] watched /cpe102-2560-2/lab-11-check endpoint");
    mainController.showLab11Check(req, res);
});

app.post('/cpe102-2560-2/exam-ii', function (req, res) {
    console.log("[ID:" + req.body.id + "] submitted with token " + req.body.token);
    mainController.gotPE2Result(req, res);
    return res.json({
        server: "OK"
    });
});

app.get('/cpe102-2560-2/practical-exam-2-check', function (req, res) {
    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    console.log("[IP:" + ip + "] watched /cpe102-2560-2/practical-exam-2-check endpoint");
    mainController.showPracticalExam2CheckFromDatabase(req, res);
});

app.get('/cpe102-2560-2/practical-exam-3-repos', function (req, res) {
    var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];
    console.log("[IP:" + ip + "] watched /cpe102-2560-2/practical-exam-3-repos endpoint");
    mainController.showPracticalExam3CheckFromGitHub(req, res);
});
