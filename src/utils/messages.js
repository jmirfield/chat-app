const generateMessage = (msg) => {
    return {
        text: msg,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}