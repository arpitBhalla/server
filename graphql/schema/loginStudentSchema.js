module.exports = `
    type StudentAuthData {
        accessToken: String!
        refreshToken:String!
        userId: String!
    }

  type Query {
     loginStudent(loginKey: String!, password: String! ,flag : String!): StudentAuthData!
  }
`;
