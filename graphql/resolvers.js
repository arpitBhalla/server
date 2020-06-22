
const loginStudent = require('./resolvers/loginStudentResolver');
const createStudent = require('./resolvers/createStudentResolver');
const sendOtp = require('./resolvers/sendOtpResolver');
const resendOtp = require('./resolvers/resendOtpResolver');
const verifyOtp = require('./resolvers/verifyOtpResolver');

module.exports = {
    Query: {
        loginStudent: loginStudent,
        sendOtp: sendOtp,
        resendOtp: resendOtp,
        verifyOtp: verifyOtp,

        //hello: () => { return "ss"; }
    },
    Mutation: {
        createStudent: createStudent,
    }
};
