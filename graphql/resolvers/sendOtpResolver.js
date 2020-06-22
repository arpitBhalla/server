const SendOtp = require('sendotp');
const validator = require('validator');

const AUTH_KEY = `332548AsCtSqYna5ee73b00P1`;

module.exports = async function (obj, { mobileno }, context, info) {
    const errors = [];
    if (
        validator.isEmpty(mobileno) ||
        !validator.isLength(mobileno, { min: 12, max: 12 })
    ) {
        errors.push({ message: 'Please enter 10 digit mobile no. with country code!' });
    }
    if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.data = errors;
        error.code = 422;
        throw error;
    }
    const sendOtp = new SendOtp(AUTH_KEY);
    sendOtp.send(mobileno, "SMSIND", function (error, data) {
        console.log(data);
        return data.type;
    });
}