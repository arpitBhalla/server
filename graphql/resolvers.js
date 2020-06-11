const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

module.exports = {
    createUser: async function ({ userInput }, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-Mail is invalid.' });
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
        ) {
            errors.push({ message: 'Password too short!' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
    login: async function ({ email, password }) {
        const user = await User.findOne({ email: email });
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
                email: user.email
            },
            'somesupersecretsecret',
            { expiresIn: '1min' }
        );
        const refreshToken = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            }, 'highsupersecretsecret',
            { expiresIn: '30d' }
        );
        const refreshoken = new RefreshToken({
            refreshToken: refreshToken
        });
        const rt = await refreshoken.save();
        return { accessToken: accessToken, refreshToken: refreshToken, userId: user._id.toString() };
    },

    hello: () => {
        return "hi there!!!!";
    }
};
