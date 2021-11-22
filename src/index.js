const http = require('http')
const app = require('./app.js')
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    socket.emit('welcome', 'Welcome to the server new person.')
    socket.broadcast.emit('broadcast-message', 'A new user has joined.')

    socket.on('send-message', (msg) => {
        io.emit('broadcast-message', msg)
    })

    socket.on('disconnect', () => {
        io.emit('broadcast-message', 'User has left.')
    })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})