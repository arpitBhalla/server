const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Student']
    },
    senderId: {
        type: Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Message', messageSchema);
