const socket = io()

//Elements
const $messageForm = document.querySelector('#send-message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('broadcast-message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('hh:mm a'),
        user: msg.username
    })
    //Checks for empty strings or strings with only whitespaces
    if (!/^\s*$/.test(msg.text)) $messages.insertAdjacentHTML('beforeend', html)
    $messages.scrollTop = $messages.scrollHeight
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = {
        value: e.target.elements.message.value,
        username,
        room
    }
    console.log(message)
    socket.emit('send-message', message, () => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    })
})

$locationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation)return alert('Geolocation is not suppported by your browser')
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('send-location', {
            lat: position.coords.latitude, 
            long: position.coords.longitude,
            username,
            room
        }, (err) => {
            $locationButton.removeAttribute('disabled')
            if(err)return alert(err)
        })
    })

})

socket.emit('join-room', { username, room })