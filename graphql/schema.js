const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const resolvers = require('./resolvers');

const loginUserSchema = require('./schema/loginUserSchema');
const createUserSchema = require('./schema/createUserSchema');
const sendOtp = require('./schema/sendOtpSchema');
const resendOtp = require('./schema/resendOtpSchema');
const verifyOtp = require('./schema/verifyOtpSchema');

const types = [
    loginUserSchema,
    createUserSchema,
    sendOtp,
    verifyOtp,
    resendOtp,
];

const typeDefs = mergeTypeDefs(types, { all: true });

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
});
