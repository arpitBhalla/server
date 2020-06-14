
const loginStudent = require('./resolvers/loginStudentResolver');
const createStudent = require('./resolvers/createStudentResolver');

module.exports = {
    Query: {
        loginStudent: loginStudent,
        //hello: () => { return "ss"; }
    },
    Mutation: {
        createStudent: createStudent,
    }
};
