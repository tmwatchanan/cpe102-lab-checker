var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('lab6_result', new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    repo: { type: String, required: true, trim: true },
    results: [],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    count: { type: Number, default: 0 }
}, { collection: 'lab6_results' }));
