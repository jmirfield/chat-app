const generateMessage = (username, msg) => {
    return {
        text: msg,
        createdAt: new Date().getTime(),
        username
    }
}

const generateLocationMessage = (username, msg) => {
    return {
        text: `Location: ${msg.city}, ${msg.state}`,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}