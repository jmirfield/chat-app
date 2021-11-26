const http = require('http')
const app = require('./app.js')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages.js')
const { getLocation } = require('./utils/geolocation.js')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js')

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000



io.on('connection', (socket) => {
    socket.on('send-message', (msg, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('broadcast-message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('broadcast-message', generateMessage('BROADCAST', `${user.username} has left the chat.`))
            io.to(user.room).emit('roomUpdate', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('send-location', (position, callback) => {
        const user = getUser(socket.id)
        getLocation(position.lat, position.long, (err, res) => {
            if(err)return callback(err)
            io.to(user.room).emit('broadcast-message', generateLocationMessage(user.username, {city: res.city, state: res.state}))
            callback()
        })
    })

    socket.on('join-room', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if(error) return callback(error)
        socket.join(user.room)
        socket.broadcast.to(user.room).emit('broadcast-message', generateMessage('BROADCAST',`${username} has joined.`))
        io.to(user.room).emit('roomUpdate', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})