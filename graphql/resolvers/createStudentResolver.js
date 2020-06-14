const bcrypt = require('bcryptjs');
const validator = require('validator');

const Student = require('../../models/Student/Student');

module.exports = async function (obj, { studentInput }, context, info) {
    const errors = [];
    if (!validator.isEmail(studentInput.email)) {
        errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
        validator.isEmpty(studentInput.password) ||
        !validator.isLength(studentInput.password, { min: 5 })
    ) {
        errors.push({ message: 'Password too short!' });
    }

    if (
        validator.isEmpty(studentInput.username) ||
        !validator.isLength(studentInput.username, { min: 5 })
    ) {
        errors.push({ message: 'Username too short!' });
    }
    // if (
    //     validator.isEmpty(studentInput.mobileno) ||
    //     !validator.isLength(studentInput.mobileno, { min: 10, max: 10 })
    // ) {
    //     errors.push({ message: 'Please enter 10 digit mobile no.!' });
    // }
    if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.data = errors;
        error.code = 422;
        throw error;
    }
    const existingStudent = await Student.findOne({ username: studentInput.username });
    if (existingStudent) {
        const error = new Error('User exists already!');
        throw error;
    }
    const hashedPw = await bcrypt.hash(studentInput.password, 12);
    const student = new Student({
        email: studentInput.email,
        name: studentInput.name,
        password: hashedPw,
        schoolusername: studentInput.schoolusername,
        username: studentInput.username,
        mobileno: studentInput.mobileno
    });
    const createdStudent = await student.save();
    return { ...createdStudent._doc, _id: createdStudent._id.toString() };
}