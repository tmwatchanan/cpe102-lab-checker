var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('pe2_result', new Schema({
    id: { type: String, required: true, unique: true, trim: true },
    token: { type: String, required: true, trim: true },
    results: [],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    count: { type: Number, default: 0 }
}, { collection: 'pe2_results' }));