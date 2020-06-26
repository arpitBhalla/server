module.exports = `
        type Mutation {
            sendMessage(messageInput: messageInputData): Message!
        }

        type Message {
            _id: ID!
            body: String!
            sender: String!
            receiver: String!
            date: String!
        }

        input MessageInputData {
            body: String!
            receiver: String!
        }
`;