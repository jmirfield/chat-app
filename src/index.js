const http = require('http')
const app = require('./app.js')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/messages.js')
const { getLocation } = require('./utils/geolocation.js')

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    //socket.broadcast.emit('broadcast-message', generateMessage('A new user has joined.'))

    socket.on('send-message', (msg, callback) => {
        io.to('test').emit('broadcast-message', generateMessage(msg))
        callback()
    })

    socket.on('disconnect', () => {
        io.to('test').emit('broadcast-message', generateMessage('User has left.'))
    })

    socket.on('send-location', (position, callback) => {
        getLocation(position.lat, position.long, (err, res) => {
            if(err)return callback(err)
            io.to('test').emit('broadcast-message', generateMessage(`Location: ${res.city}, ${res.state}`))
            callback()
        })
    })

    socket.on('join-room', ({ username, room }) => {
        socket.join(room)
        socket.broadcast.to(room).emit('broadcast-message', generateMessage(`${username} has joined.`))
    })

})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})