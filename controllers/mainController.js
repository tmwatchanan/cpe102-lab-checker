var mongoose = require('mongoose');
var PE1Result = require('../models/PE1Result');
var Lab6Result = require('../models/Lab6Result');
var StudentInformation = require('../data/StudentInformation');
var async = require('async');
var GitHubApi = require('github');
const github = new GitHubApi({
    debug: true
});

exports.gotPE1Result = function (req, res) {
    var query = { id: req.body.id },
        update = { token: req.body.token, results: req.body.results, updated: Date.now() },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    PE1Result.findOneAndUpdate(query, update, options, function (error, document) {
        if (error) return;

        // do something with the document
        document.count = document.count + 1;
        document.save();
        // return res.json({
        //     server: "OK",
        //     id: req.body.id,
        //     token: req.body.token,
        //     results: req.body.results
        // });
    });
};

exports.showPracticalExam1CheckFromDatabase = function (req, res) {
    PE1Result.find({}).sort({ id: 1 }).exec(function (err, documents) {
        var PE1List = [];
        documents.forEach(document => {
            let PE1Object = {
                id: document.id,
                token: document.token,
                results: document.results,
                count: document.count,
                q1: {},
                q2: {}
            };
            if (document.token == "12331513795452" || document.token == "12331375195452" || document.token == "12331354751952") {
                PE1Object.exam = "A";
                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12653541265-";
                PE1Object.buildUrl = "https://travis-ci.com/cpe102-2560-2/pe12653541265-"
            } else if (document.token == "1527213502219" || document.token == "1213502527219" || document.token == "1213502725219") {
                PE1Object.exam = "B";
                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12656941265-";
                PE1Object.buildUrl = "https://travis-ci.com/cpe102-2560-2/pe12656941265-"
            }
            if (document.id) {
                let studentInfo = StudentInformation.find(student => student.student_id === document.id);
                if (studentInfo.length != 0) {
                    PE1Object.repoUrl += studentInfo.username;
                    PE1Object.buildUrl += studentInfo.username;
                    console.log(PE1Object.id, studentInfo.username);
                } else {
                    PE1Object.repoUrl = "#";
                    PE1Object.buildUrl = "#";
                }
            }
            document.results.forEach(result => {
                const question = result.name.split(/[.]+/).shift();
                const testcase = result.name.split(/[.]+/).pop();
                const testStatus = (result.status == "OK" ? "OK" : "NO");
                if (question == "pracex1_3") {
                    switch (testcase) {
                        case "test_case_1":
                            PE1Object.q1.tc1 = testStatus;
                            break;
                        case "test_case_2":
                            PE1Object.q1.tc2 = testStatus;
                            break;
                        case "test_case_3":
                            PE1Object.q1.tc3 = testStatus;
                            break;
                        case "test_case_4":
                            PE1Object.q1.tc4 = testStatus;
                            break;
                        case "test_case_5":
                            PE1Object.q1.tc5 = testStatus;
                            break;
                        case "test_case_6":
                            PE1Object.q1.tc6 = testStatus;
                            break;
                        case "test_case_7":
                            PE1Object.q1.tc7 = testStatus;
                            break;
                        case "blind_case_1":
                            PE1Object.q1.bc1 = testStatus;
                            break;
                        case "blind_case_2":
                            PE1Object.q1.bc2 = testStatus;
                            break;
                        case "blind_case_3":
                            PE1Object.q1.bc3 = testStatus;
                            break;
                        case "blind_case_4":
                            PE1Object.q1.bc4 = testStatus;
                            break;
                        case "blind_case_5":
                            PE1Object.q1.bc5 = testStatus;
                            break;
                        default:
                            break;
                    }
                } else if (question == "pracex1_4") {
                    switch (testcase) {
                        case "test_case_1":
                            PE1Object.q2.tc1 = testStatus;
                            break;
                        case "test_case_2":
                            PE1Object.q2.tc2 = testStatus;
                            break;
                        case "test_case_3":
                            PE1Object.q2.tc3 = testStatus;
                            break;
                        case "test_case_4":
                            PE1Object.q2.tc4 = testStatus;
                            break;
                        case "test_case_5":
                            PE1Object.q2.tc5 = testStatus;
                            break;
                        case "test_case_6":
                            PE1Object.q2.tc6 = testStatus;
                            break;
                        case "test_case_7":
                            PE1Object.q2.tc7 = testStatus;
                            break;
                        case "test_case_8":
                            PE1Object.q2.tc8 = testStatus;
                            break;
                        case "test_case_9":
                            PE1Object.q2.tc9 = testStatus;
                            break;
                        case "blind_case_1":
                            PE1Object.q2.bc1 = testStatus;
                            break;
                        case "blind_case_2":
                            PE1Object.q2.bc2 = testStatus;
                            break;
                        case "blind_case_3":
                            PE1Object.q2.bc3 = testStatus;
                            break;
                        case "blind_case_4":
                            PE1Object.q2.bc4 = testStatus;
                            break;
                        default:
                            break;
                    }
                }
            });
            PE1List.push(PE1Object);
        });
        res.render('pe1-checker', {
            PE1List: PE1List
        });
    });
};

function getRepoFromOrgCallback(pageNum) {
    return function (callback) {
        github.repos.getForOrg({
            org: 'cpe102-2560-2',
            type: 'private',
            per_page: 100,
            page: pageNum
        }).then(result => {
            callback(null, result.data);
        });
    }
}

exports.showPracticalExam1CheckFromGitHub = function (req, res) {
    github.authenticate({
        type: 'token',
        token: process.env.githubToken
    });
    let seriesOfCallback = [];
    for (let p = 1; p <= 10; ++p) {
        seriesOfCallback.push(getRepoFromOrgCallback(p));
    }
    let studentDict = {};
    StudentInformation.forEach(function (student) {
        studentDict[student.username.toLowerCase()] = student.student_id;
    });
    var PE1List = [];
    async.series(seriesOfCallback, function (err, results) {
        results.forEach(result => {
            result.forEach(repo => {
                if (repo.name.indexOf("pe12") !== -1) {
                    let repoObject = {
                        username: repo.name.split(/[-]+/).pop(),
                        repo_name: repo.name,
                        full_name: repo.full_name
                    };
                    let studentInfo = studentDict[repoObject.username.toLowerCase()];
                    repoObject.student_id = studentInfo;
                    PE1Result.findOne({ "id": repoObject.student_id }).exec(function (err, document) {
                        let PE1Object = {
                            id: "",
                            token: "",
                            username: repoObject.username,
                            githubUrl: "https://github.com/" + repoObject.username,
                            repo_name: repoObject.repo_name,
                            full_name: repoObject.full_name,
                            results: "",
                            count: "",
                            q1: {},
                            q2: {}
                        };
                        if (document) {
                            PE1Object.id = document.id;
                            PE1Object.token = document.token;
                            PE1Object.results = document.results;
                            PE1Object.count = document.count;
                            if (document.token == "12331513795452" || document.token == "12331375195452" || document.token == "12331354751952") {
                                PE1Object.exam = "A";
                                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12653541265-";
                                PE1Object.buildUrl = "https://travis-ci.com/cpe102-2560-2/pe12653541265-"
                            } else if (document.token == "1527213502219" || document.token == "1213502527219" || document.token == "1213502725219") {
                                PE1Object.exam = "B";
                                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12656941265-";
                                PE1Object.buildUrl = "https://travis-ci.com/cpe102-2560-2/pe12656941265-"
                            }
                            if (document.id) {
                                let studentInfo = StudentInformation.find(student => student.student_id === document.id);
                                if (studentInfo.length != 0) {
                                    PE1Object.repoUrl += studentInfo.username;
                                    PE1Object.buildUrl += studentInfo.username;
                                } else {
                                    PE1Object.repoUrl = "#";
                                    PE1Object.buildUrl = "#";
                                }
                            }
                            document.results.forEach(result => {
                                const question = result.name.split(/[.]+/).shift();
                                const testcase = result.name.split(/[.]+/).pop();
                                const testStatus = (result.status == "OK" ? "OK" : "NO");
                                if (question == "pracex1_3") {
                                    switch (testcase) {
                                        case "test_case_1":
                                            PE1Object.q1.tc1 = testStatus;
                                            break;
                                        case "test_case_2":
                                            PE1Object.q1.tc2 = testStatus;
                                            break;
                                        case "test_case_3":
                                            PE1Object.q1.tc3 = testStatus;
                                            break;
                                        case "test_case_4":
                                            PE1Object.q1.tc4 = testStatus;
                                            break;
                                        case "test_case_5":
                                            PE1Object.q1.tc5 = testStatus;
                                            break;
                                        case "test_case_6":
                                            PE1Object.q1.tc6 = testStatus;
                                            break;
                                        case "test_case_7":
                                            PE1Object.q1.tc7 = testStatus;
                                            break;
                                        case "blind_case_1":
                                            PE1Object.q1.bc1 = testStatus;
                                            break;
                                        case "blind_case_2":
                                            PE1Object.q1.bc2 = testStatus;
                                            break;
                                        case "blind_case_3":
                                            PE1Object.q1.bc3 = testStatus;
                                            break;
                                        case "blind_case_4":
                                            PE1Object.q1.bc4 = testStatus;
                                            break;
                                        case "blind_case_5":
                                            PE1Object.q1.bc5 = testStatus;
                                            break;
                                        default:
                                            break;
                                    }
                                } else if (question == "pracex1_4") {
                                    switch (testcase) {
                                        case "test_case_1":
                                            PE1Object.q2.tc1 = testStatus;
                                            break;
                                        case "test_case_2":
                                            PE1Object.q2.tc2 = testStatus;
                                            break;
                                        case "test_case_3":
                                            PE1Object.q2.tc3 = testStatus;
                                            break;
                                        case "test_case_4":
                                            PE1Object.q2.tc4 = testStatus;
                                            break;
                                        case "test_case_5":
                                            PE1Object.q2.tc5 = testStatus;
                                            break;
                                        case "test_case_6":
                                            PE1Object.q2.tc6 = testStatus;
                                            break;
                                        case "test_case_7":
                                            PE1Object.q2.tc7 = testStatus;
                                            break;
                                        case "test_case_8":
                                            PE1Object.q2.tc8 = testStatus;
                                            break;
                                        case "test_case_9":
                                            PE1Object.q2.tc9 = testStatus;
                                            break;
                                        case "blind_case_1":
                                            PE1Object.q2.bc1 = testStatus;
                                            break;
                                        case "blind_case_2":
                                            PE1Object.q2.bc2 = testStatus;
                                            break;
                                        case "blind_case_3":
                                            PE1Object.q2.bc3 = testStatus;
                                            break;
                                        case "blind_case_4":
                                            PE1Object.q2.bc4 = testStatus;
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });
                        } else {
                            PE1Object.id = repoObject.student_id;
                            PE1Object.token = "unknown";
                            PE1Object.results = "unknown";
                            PE1Object.count = "-1";
                            let examSuite = PE1Object.repo_name.split(/[-]+/).shift();
                            if (examSuite == "pe12653541265") {
                                PE1Object.exam = "A";
                                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12653541265-";
                                PE1Object.buildUrl = "https://travis-ci.com/cpe102-2560-2/pe12653541265-"
                            } else if (examSuite == "pe12656941265") {
                                PE1Object.exam = "B";
                                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12656941265-";
                                PE1Object.buildUrl = "https://travis-ci.com/cpe102-2560-2/pe12656941265-"
                            }
                            PE1Object.repoUrl += PE1Object.username;
                            PE1Object.buildUrl += PE1Object.username;
                        }
                        PE1List.push(PE1Object);
                        if (PE1List.length == 111) {
                            res.render('pe1-checker-github', {
                                PE1List: PE1List.sort(function (a, b) {
                                    return parseInt(a.id) - parseInt(b.id);
                                })
                            });
                        }
                    });
                }
            });
        });
    });
};

exports.lab6Submit = function (req, res) {
    var query = { username: req.body.username, repo: req.body.repo },
        update = { results: req.body.results, updated: Date.now() },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        // Find the document
        Lab6Result.findOneAndUpdate(query, update, options, function (error, document) {
            if (error) return;

            // do something with the document
            document.count = document.count + 1;
            document.save();
            // return res.json({
            //     server: "OK",
            //     id: req.body.id,
            //     token: req.body.token,
            //     results: req.body.results
            // });
        });
    } catch (error) {
        console.log("[ERROR] in lab6Submit");
        console.log(error);
    }
};

exports.showLab6Check = function (req, res) {
    Lab6Result.find({}).sort({ id: 1 }).exec(function (err, documents) {
        var Lab6ResultList = [];
        documents.forEach(document => {
            const student = StudentInformation.find(student => student.username.toLowerCase() == document.username.toLowerCase());
            let Lab6Result = {
                username: document.username,
                id: "",
                token: document.token,
                results: document.results,
                count: document.count,
                created: document.created,
                updated: document.updated,
                q3: {},
                repoUrl: 'https://github.com/cpe102-2560-2/' + document.repo,
                buildUrl: 'https://travis-ci.com/cpe102-2560-2/' + document.repo
            };
            if (student) {
                Lab6Result.id = student.student_id;
            }
            document.results.forEach(result => {
                const question = result.name.split(/[.]+/).shift();
                const testcase = result.name.split(/[.]+/).pop();
                const testStatus = (result.status == "OK" ? "OK" : "NO");
                if (question == "lab6_3") {
                    switch (testcase) {
                        case "test_case_1":
                            Lab6Result.q3.tc1 = testStatus;
                            break;
                        case "test_case_2":
                            Lab6Result.q3.tc2 = testStatus;
                            break;
                        case "test_case_3":
                            Lab6Result.q3.tc3 = testStatus;
                            break;
                        case "test_case_4":
                            Lab6Result.q3.tc4 = testStatus;
                            break;
                        case "test_case_5":
                            Lab6Result.q3.tc5 = testStatus;
                            break;
                        case "test_case_6":
                            Lab6Result.q3.tc6 = testStatus;
                            break;
                        case "test_case_7":
                            Lab6Result.q3.tc7 = testStatus;
                            break;
                        case "test_case_8":
                            Lab6Result.q3.tc8 = testStatus;
                            break;
                        default:
                            break;
                    }
                }
            });
            Lab6ResultList.push(Lab6Result);
        });
        var SortedLab6ResultList = Lab6ResultList.sort(function (a, b) { return a.id - b.id });
        res.render('lab6-checker', {
            Lab6ResultList: SortedLab6ResultList
        });
    });
};
