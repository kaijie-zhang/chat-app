const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getOnlineUsersInRoom, getOfflineUsersInRoom} = require('./utils/users')
const { addRoom, removeRoom, getRooms, roomExists, getOtherRooms} = require('./utils/rooms')



const app  = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('roomsList', getRooms())

    socket.on('join', (options, callback) => {

        const {error, user} = addUser({ id: socket.id, ...options})

        if (error) {
            return callback(error)
        }

        if (!roomExists(user.room)){
            addRoom(user.room)
        }
        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room!`))

        console.log('Online users in room ', getOnlineUsersInRoom(user.room))

        emitRoomData(user)
    
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)

        if (filter.isProfane(message)) { 
            io.to(user.room).emit('message', generateMessage(user.username, filter.clean(message)))
            callback({"swore": true})
        } else{
            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback('Delivered')
        }

    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))

            if (getOnlineUsersInRoom(user.room).length == 0){
                removeRoom(user.room)
            }
            emitRoomData(user)
        }
        
    })

    socket.on('kickUser', () => {
        const user = removeUser(socket.id)
        io.to(user.room).emit('message', generateMessage('Admin', `${user.username}has been kicked because he/she swore too much!`))
        emitRoomData(user)
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        console.log('sendLocation user', user)
        const locationUrl = `https://google.com/maps?q=${location.lat},${location.long}`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, locationUrl))
        callback()
    })
})

const emitRoomData = (user) => {
    // Update room data for the room
    io.to(user.room).emit('roomData', {
        room: user.room,
        onlineUsers: getOnlineUsersInRoom(user.room),
        offlineUsers: getOfflineUsersInRoom(user.room),
        allRooms: getRooms(),
        currentUsername : user.username
    })
}


server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

