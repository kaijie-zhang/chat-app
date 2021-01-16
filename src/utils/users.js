const { addRoom, removeRoom, getRooms, roomExists, getOtherRooms} = require('./rooms')

const onlineUsers = []
const offlineUsers = []

// addUser, removeUser, getUser, getUsers

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = onlineUsers.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    onlineUsers.push(user)

    // Remove user from offline users
    const offlineUsersIndex = offlineUsers.findIndex(userElement => userElement.username === user.username)
    if (offlineUsersIndex > -1){
        offlineUsers.splice(offlineUsersIndex, 1)
    }
    return { user }
}

const removeUser = (id) => {
    const index = onlineUsers.findIndex((user) => user.id === id)

    if (index !== -1){
        user = onlineUsers[index]
        if (!offlineUsers.some(userElement => userElement.username === user.username)){
            offlineUsers.push(user)
        }
        if (getOnlineUsersInRoom(user.room).length == 0){
            removeRoom(user.room)
        }
        return onlineUsers.splice(index, 1)[0]
    }


}

const getUser = (id) => {
    const user = onlineUsers.find((user) => user.id === id)
    return user
}

const getOnlineUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    console.log(room)
    console.log(onlineUsers)
    const onlineUsersInRoom = onlineUsers.filter((user) => user.room === room)
    return onlineUsersInRoom
}

const getOfflineUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const offlineUsersInRoom = offlineUsers.filter((user) => user.room === room)
    return offlineUsersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getOnlineUsersInRoom,
    getOfflineUsersInRoom
}

