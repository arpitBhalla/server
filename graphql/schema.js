const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const resolvers = require('./resolvers');

const loginStudentSchema = require('./schema/loginStudentSchema');
const createStudentSchema = require('./schema/createStudentSchema');
const sendOtp = require('./schema/sendOtpSchema');
const resendOtp = require('./schema/resendOtpSchema');
const verifyOtp = require('./schema/verifyOtpSchema');

const types = [
    loginStudentSchema,
    createStudentSchema,
    sendOtp,
    verifyOtp,
    resendOtp,
];

const typeDefs = mergeTypeDefs(types, { all: true });

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
});
