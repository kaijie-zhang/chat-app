const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

const generateAdminMessage = (text) => {
    return {
        text
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}