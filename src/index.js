const http = require('http')
const app = require('./app.js')
const socketio = require('socket.io')
const request = require('request')
const { generateMessage } = require('./utils/messages.js')

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    socket.broadcast.emit('broadcast-message', generateMessage('A new user has joined.'))

    socket.on('send-message', (msg, callback) => {
        io.emit('broadcast-message', generateMessage(msg))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('broadcast-message', generateMessage('User has left.'))
    })

    socket.on('send-geo', (position, callback) => {
        request({
            url: `http://api.positionstack.com/v1/reverse?access_key=${process.env.GEO_KEY}&query=${position.lat},${position.long}&limit=1`,
            json: true
        }, (error, response) => {
            if(error || response.body.error)return callback('Error with API')
            io.emit('broadcast-message', generateMessage(`Location - ${response.body.data[0].locality}, ${response.body.data[0].region}`))
            callback()
        })
    })
})

server.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})