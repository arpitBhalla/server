module.exports = `
        type Mutation {
            createUser(userInput: UserInputData): User!
        }

        type User {
            _id: ID!
            name: String!
            email: String!
            password: String!
            username: String!
            usertype:  String!
            schoolusername: String!
            mobileno: String!
        }

        input UserInputData {
            name: String!
            email: String!
            password: String!
            usertype: String!
            username: String!
            schoolusername: String!
            mobileno: String!
        }
`;