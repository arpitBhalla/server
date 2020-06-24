// const mongoose = require('mongoose');
// const { FilterInputObjectFields } = require('graphql-tools');
// const Schema = mongoose.Schema;

// const studentSchema = new Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     username: {
//         type: String,
//         required: true
//     },
//     schoolusername: {
//         type: String,
//         required: true
//     },
//     mobileno: {
//         type: Number,
//         required: true
//     },
//     onModel: {
//         type: String,
//         enum: ['Student']
//     },
//     friends: [
//         {
//             friend: {
//                 type: Schema.Types.ObjectId,
//                 refPath: 'onModel'
//             },
//             chat: {
//                 type: Schema.Types.ObjectId,
//                 ref: 'Chat'
//             }
//         }
//     ],
//     // status: {
//     //     type: String,
//     //     default: 'I am new!'
//     // },
//     //   posts: [
//     //     {
//     //       type: Schema.Types.ObjectId,
//     //       ref: 'Post'
//     //     }
//     //   ]
// });

// module.exports = mongoose.model('Student', studentSchema);
