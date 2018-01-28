var mongoose = require('mongoose');
var PE1Result = require('../models/PE1Result');

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
    PE1Result.find({}).sort({ id: 1}).exec(function (err, documents) {
        var PE1List = [];
        documents.forEach(document => {
            let PE1Object = {
                id: document.id,
                token: document.token,
                results: document.results,
                count: document.count
            };
            PE1List.push(PE1Object);
        });
        res.render('pe1-checker', {
            PE1List: PE1List
        });
    });
};

exports.lab6Submit = function (req, res) {
    var query = { username: req.body.username },
        update = { repo: req.body.repo, results: req.body.results, updated: Date.now() },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    PE1Result.findOneAndUpdate(query, update, options, function (error, document) {
        if (error) return;

        // do something with the document
        document.count = document.count + 1;
        document.save();
        return res.json({
            server: "OK"
        });
        // return res.json({
        //     server: "OK",
        //     id: req.body.id,
        //     token: req.body.token,
        //     results: req.body.results
        // });
    });
};
