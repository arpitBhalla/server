const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: Date().now
    }
}
module.exports = {generateMessage};
