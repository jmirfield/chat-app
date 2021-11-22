const socket = io()

socket.on('count', (count) => {
    console.log(`Current count: ${count}`)
})

socket.on('welcome', (msg) => {
    console.log(msg)
})

socket.on('broadcast-message', (msg) => {
    console.log(msg)
})

const messageForm = document.querySelector('#send-message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('send-message', message)
})