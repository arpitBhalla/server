const mongoose = require('mongoose');
const PersonalChat = require('./models/chat/personalChat');
const User = require('./models/User/user');
const Message = require('./models/chat/message');
const { VariablesInAllowedPositionRule } = require('graphql');
const message = require('./models/chat/message');
const getUserName = async (userId) => {
    const { username, error_in_username } = await User.findOne({ _id: userId }).then((doc) => {
        if (doc) {
            var name = doc.name;
            return { username: name, error_in_username: undefined };
        }
        else {
            return { username: undefined, error_in_username: 'No User is found' }
        }
    })
        .catch((err) => {

            return { username: undefined, error_in_username: 'some connection error in finding name' };
        })
    return { username, error_in_username };
}

const getUserRoom = async (userId, phoneNo) => {
    let error_in_room = undefined;
    let room = undefined;
    const userId2 = await User.findOne({ mobileno: phoneNo }).then((doc) => {
        if (doc) {
            return doc._id;
        }
        else {
            error_in_room = 'Second User is Not present';
            return undefined;
        }
    }).catch((err) => {
        error_in_room = 'Error in GetUserRoom ';
        return undefined;
    })

    if (userId2 == undefined || userId == undefined) {
        return { room, error_in_room };
    }
    var small = '';
    var large = '';
    if (userId < userId2) {
        small = userId;
        large = userId2;
    }
    else {
        small = userId2;
        large = userId;
    }

    room = await PersonalChat.findOne({ room: small + large }).
        then(async (doc) => {
            if (doc) {
                return doc.room;
            }
            else {
                var newRoom = new PersonalChat({
                    room: small + large,
                    users: [userId, userId2],
                });
                await newRoom.save((err) => {
                    if (err) {
                        throw err;
                    }
                });
                if (newRoom == undefined) {
                    error_in_room = 'some error in creating room';
                    return undefined;
                }
                else {
                    newRoom.room;
                }
            }
        })
        .catch((err) => {
            error_in_room = err;
            return undefined;
        })
console.log(room,error_in_room);
if(room==undefined && error_in_room==undefined){
    error_in_room='some error refresh again';
}
    return { room, error_in_room };


}
const saveMessage = async (room, message, senderId) => {

    let error_in_message = undefined;
    const createMessage = new Message({
        messageType: 'text',
        body: message,
        sender: senderId,
        date: Date.now(),
    });

    await createMessage.save((err) => {
        if (err) {
            error_in_message = err;
        }
    });
    console.log(createMessage);
    await PersonalChat.findOne({ room: room }).then((doc) => {
        if (doc) {
            doc.messages.push(createMessage._id);
            doc.save();
        }
        else {
            error_in_message = 'some error in save message';
        }
    })
        .catch((err) => {
            error_in_message = 'error in save message personal chat';
        })
    return { message: createMessage, error_in_message };
}

const allMessages = async (room) => {
    console.log('hello');
    const allIds = await PersonalChat.findOne({ room: room }).then((doc) => {
        if (doc) {
            return doc.messages;
        }
    })
    if (allIds != undefined) {
        var z = (allIds) => {
            return new Promise(async (resolve, reject) => {
                let messages = [];
                for (var i = 0; i < allIds.length; i++) {
                    const m = await Message.findOne({ _id: allIds[i] }).then((doc) => doc);
                    messages.push(m.body);
                }
                resolve(messages)
            })
        }
        return z(allIds).then((messages) => {
            console.log(messages);
            return {messages:messages,error:undefined};
        })
    }
    return [];
}

module.exports = { getUserRoom, getUserName, saveMessage, allMessages };