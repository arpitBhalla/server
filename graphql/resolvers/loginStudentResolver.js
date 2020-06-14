const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Student = require('../../models/Student/Student');
const RefreshToken = require('../../models/refreshToken');

module.exports = async function (obj, { loginKey, password, flag }, context, info) {
    // const email = args.email;
    // const password = args.password;

    if (flag === "username")
        student = await Student.findOne({ username: loginKey });
    else
        student = await Student.findOne({ mobileno: loginKey });
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@1");
    if (!student) {
        console.log(student);
        const error = new Error('User not found.');
        error.code = 401;
        throw error;
    }
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2");
    const isEqual = await bcrypt.compare(password, student.password);
    if (!isEqual) {
        //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@3");
        const error = new Error('Password is incorrect.');
        error.code = 401;
        throw error;
    }
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@4");
    const accessToken = jwt.sign(
        {
            userId: student._id.toString(),
            username: student.username
        },
        'somesupersecretsecret',
        { expiresIn: '1min' }
    );
    const refreshToken = jwt.sign(
        {
            userId: student._id.toString(),
            username: student.username
        }, 'highsupersecretsecret',
        { expiresIn: '30d' }
    );
    const refreshoken = new RefreshToken({
        refreshToken: refreshToken
    });
    const rt = await refreshoken.save();
    return { accessToken: accessToken, refreshToken: refreshToken, userId: student._id.toString() };
};