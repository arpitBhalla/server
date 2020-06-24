
const loginUser = require('./resolvers/loginUserResolver');
const createUser = require('./resolvers/createUserResolver');
const sendOtp = require('./resolvers/sendOtpResolver');
const resendOtp = require('./resolvers/resendOtpResolver');
const verifyOtp = require('./resolvers/verifyOtpResolver');

module.exports = {
    Query: {
        loginUser: loginUser,
        sendOtp: sendOtp,
        resendOtp: resendOtp,
        verifyOtp: verifyOtp,

        //hello: () => { return "ss"; }
    },
    Mutation: {
        createUser: createUser,
    }
};
