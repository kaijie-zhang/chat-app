const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app  = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {

        const {error, user} = addUser({ id: socket.id, ...options})

        console.log(getUsersInRoom(user.room))

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room!`))

        console.log('From server: ' + getUsersInRoom(user.room))


        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        
        

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
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })

    socket.on('kickUser', () => {
        const user = removeUser(socket.id)
        io.to(user.room).emit('message', generateMessage('Admin', `${user.username}has been kicked because he/she swore too much!`))
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        const locationUrl = `https://google.com/maps?q=${location.lat},${location.long}`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, locationUrl))
        callback()
    })
})


server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

