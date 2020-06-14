module.exports = `
        type Mutation {
            createStudent(studentInput: StudentInputData): Student!
        }

        type Student {
            _id: ID!
            name: String!
            email: String!
            password: String!
            username: String!
            schoolusername: String!
            mobileno: String!
        }

        input StudentInputData {
            name: String!
            email: String!
            password: String!
            username: String!
            schoolusername: String!
            mobileno: String!
        }
`;