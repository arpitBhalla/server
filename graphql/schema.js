const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const resolvers = require('./resolvers');

const loginStudentSchema = require('./schema/loginStudentSchema');
const createStudentSchema = require('./schema/createStudentSchema');

const types = [
    loginStudentSchema,
    createStudentSchema,
];

const typeDefs = mergeTypeDefs(types, { all: true });

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
});
