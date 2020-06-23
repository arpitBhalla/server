const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
});

module.exports = mongoose.model('Chat', chatSchema);
