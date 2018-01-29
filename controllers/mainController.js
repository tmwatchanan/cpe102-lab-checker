var mongoose = require('mongoose');
var PE1Result = require('../models/PE1Result');
var Lab6Result = require('../models/Lab6Result');
var StudentInformation = require('../data/StudentInformation');

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

exports.showPracticalExam1Check = function (req, res) {
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
                let studentInfo = StudentInformation.filter(a => a.student_id == document.id);
                if (studentInfo.length != 0) {
                    PE1Object.repoUrl += studentInfo[0].username;
                    PE1Object.buildUrl += studentInfo[0].username;
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
