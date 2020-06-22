module.exports = `
  type Query {
     verifyOtp(mobileno: String!,otp: String!): String
  }
`;