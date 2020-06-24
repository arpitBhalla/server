const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    messageType: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Message', messageSchema);
