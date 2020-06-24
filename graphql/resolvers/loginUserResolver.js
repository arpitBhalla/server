const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../../models/User/user');
const RefreshToken = require('../../models/refreshToken');

module.exports = async function (obj, { loginKey, password, flag }, context, info) {
    // const email = args.email;
    // const password = args.password;

    if (flag === "username")
        user = await User.findOne({ username: loginKey });
    else
        user = await User.findOne({ mobileno: loginKey });
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@1");
    if (!user) {
        console.log(user);
        const error = new Error('User not found.');
        error.code = 401;
        throw error;
    }
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2");
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@3");
        const error = new Error('Password is incorrect.');
        error.code = 401;
        throw error;
    }
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@4");
    const accessToken = jwt.sign(
        {
            userId: user._id.toString(),
            username: user.username
        },
        'somesupersecretsecret',
        { expiresIn: '1min' }
    );
    const refreshToken = jwt.sign(
        {
            userId: user._id.toString(),
            username: user.username
        }, 'highsupersecretsecret',
        { expiresIn: '30d' }
    );
    const refreshoken = new RefreshToken({
        refreshToken: refreshToken
    });
    const rt = await refreshoken.save();
    return { accessToken: accessToken, refreshToken: refreshToken, userId: user._id.toString() };
};