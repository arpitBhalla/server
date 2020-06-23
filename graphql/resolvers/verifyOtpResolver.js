const SendOtp = require('sendotp');
const validator = require('validator');

const AUTH_KEY = `332548AsCtSqYna5ee73b00P1`;

module.exports = async function (obj, { mobileno, otp }, context, info) {
    const errors = [];
    if (
        validator.isEmpty(otp) ||
        !validator.isLength(otp, { min: 4 })
    ) {
        errors.push({ message: 'OTP too short. Please enter 4 digit OTP!' });
    }
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
    let result = "sonika";
    const sendOtp = new SendOtp(AUTH_KEY);

    let optPromise = (mobileno, otp) => {
        
        return new Promise((resolve, reject) => {
            console.log(mobileno,otp);
            sendOtp.verify(mobileno, otp, function (error, data) {
                if (data.type == null) {
                    reject('some error in otp');
                }
                if (data.type == 'success') {
                    console.log('OTP verified successfully');
                }
                if (data.type == 'error') {
                    console.log('OTP verification failed');
                }
                // console.log(data);
                result = data.type;
                console.log(result);
                resolve(data.type);
            }
            )
        })
    };
    return optPromise(mobileno, otp).then((fact) => {
        console.log('hi i am in promise', fact);
        return fact;
    })
};
