var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// module.exports = mongoose.model('User', new Schema({
//     uid: { type: Number, required: true, unique: true },
//     words: [],
//     created: { type: Date, default: Date.now }
// }, { collection: 'users' }));

module.exports = mongoose.model('pe1_result', new Schema({
    id: { type: String, required: true, unique: true, trim: true },
    token: { type: String, required: true, trim: true },
    results: [],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    count: { type: Number, default: 0 }
}, { collection: 'pe1_results' }));