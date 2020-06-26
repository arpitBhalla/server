module.exports = `
    type UserAuthData {
        accessToken: String!
        refreshToken:String!
        userId: String!
    }

  type Query {
     loginUser(loginKey: String!, password: String! ,flag : String!): UserAuthData!
  }
`;
