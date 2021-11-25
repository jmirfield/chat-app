const generateMessage = (msg) => {
    return {
        text: msg.value,
        createdAt: new Date().getTime(),
        username: msg.username
    }
}

module.exports = {
    generateMessage
}