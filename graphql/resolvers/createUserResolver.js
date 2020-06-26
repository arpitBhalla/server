const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../../models/User/user');

module.exports = async function (obj, { userInput }, context, info) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
        errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
        validator.isEmpty(userInput.password) ||
        !validator
            .isLength(userInput.password, { min: 5 })
    ) {
        errors.push({ message: 'Password too short!' });
    }

    if (
        validator.isEmpty(userInput.username) ||
        !validator.isLength(userInput.username, { min: 5 })
    ) {
        errors.push({ message: 'Username too short!' });
    }
    // if (
    //     validator.isEmpty(userInput.mobileno) ||
    //     !validator.isLength(userInput.mobileno, { min: 10, max: 10 })
    // ) {
    //     errors.push({ message: 'Please enter 10 digit mobile no.!' });
    // }
    if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.data = errors;
        error.code = 422;
        throw error;
    }
    const existingUser = await User.findOne({ username: userInput.username });
    if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
        email: userInput.email,
        name: userInput.name,
        password: hashedPw,
        userType: userInput.usertype,
        schoolusername: userInput.schoolusername,
        username: userInput.username,
        mobileno: userInput.mobileno
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
}