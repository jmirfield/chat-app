const generateMessage = (msg, username='---') => {
    return {
        text: msg,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    generateMessage
}