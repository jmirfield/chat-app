const http = require('http')
const app = require('./app.js')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/messages.js')
const { getLocation } = require('./utils/geolocation.js')
<<<<<<< HEAD
const { addUser, removeUser, users } = require('./utils/users.js')
=======
>>>>>>> 9518556 (Added login page and starting to create logic for users)

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    //socket.broadcast.emit('broadcast-message', generateMessage('A new user has joined.'))

    socket.on('send-message', (msg, callback) => {
<<<<<<< HEAD
        console.log(msg)
        io.to(msg.room).emit('broadcast-message', generateMessage(msg.value, msg.username))
=======
        io.to('test').emit('broadcast-message', generateMessage(msg))
>>>>>>> 9518556 (Added login page and starting to create logic for users)
        callback()
    })

    socket.on('disconnect', () => {
        io.to('test').emit('broadcast-message', generateMessage('User has left.'))
    })

<<<<<<< HEAD
    socket.on('send-location', (msg, callback) => {
        getLocation(msg.lat, msg.long, (err, res) => {
            if(err)return callback(err)
            io.to(msg.room).emit('broadcast-message', generateMessage(`Location: ${res.city}, ${res.state}`, msg.username))
=======
    socket.on('send-location', (position, callback) => {
        getLocation(position.lat, position.long, (err, res) => {
            if(err)return callback(err)
            io.to('test').emit('broadcast-message', generateMessage(`Location: ${res.city}, ${res.state}`))
>>>>>>> 9518556 (Added login page and starting to create logic for users)
            callback()
        })
    })

    socket.on('join-room', ({ username, room }) => {
        socket.join(room)
<<<<<<< HEAD
        addUser({id: 1, username, room})
=======
>>>>>>> 9518556 (Added login page and starting to create logic for users)
        socket.broadcast.to(room).emit('broadcast-message', generateMessage(`${username} has joined.`))
    })

})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})