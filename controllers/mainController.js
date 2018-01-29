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
                count: document.count
            };
            if (document.token == "12331513795452" || document.token == "12331375195452" || document.token == "12331354751952") {
                PE1Object.exam = "A";
                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12653541265-";
            } else if (document.token == "1527213502219" || document.token == "1213502527219" || document.token == "1213502725219") {
                PE1Object.exam = "B";
                PE1Object.repoUrl = "https://github.com/cpe102-2560-2/pe12656941265-";
            }
            if (document.id) {
                let studentInfo = StudentInformation.filter(a => a.student_id == document.id);
                if (studentInfo.length != 0) {
                    PE1Object.repoUrl += studentInfo[0].username;
                } else {
                    PE1Object.repoUrl = "#";
                }
            }
            document.results.forEach(result => {
                const testcase = result.name.split(/[.]+/).pop();
                switch (testcase) {
                    case "test_case_1":
                        PE1Object.tc1 = result.status;
                        break;
                    case "test_case_2":
                        PE1Object.tc2 = result.status;
                        break;
                    case "test_case_3":
                        PE1Object.tc3 = result.status;
                        break;
                    case "test_case_4":
                        PE1Object.tc4 = result.status;
                        break;
                    case "test_case_5":
                        PE1Object.tc5 = result.status;
                        break;
                    case "test_case_6":
                        PE1Object.tc6 = result.status;
                        break;
                    case "test_case_7":
                        PE1Object.tc7 = result.status;
                        break;
                    case "blind_case_1":
                        PE1Object.bc1 = result.status;
                        break;
                    case "blind_case_2":
                        PE1Object.bc2 = result.status;
                        break;
                    case "blind_case_3":
                        PE1Object.bc3 = result.status;
                        break;
                    case "blind_case_4":
                        PE1Object.bc4 = result.status;
                        break;
                    case "blind_case_5":
                        PE1Object.bc5 = result.status;
                        break;
                    default:
                        break;
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
