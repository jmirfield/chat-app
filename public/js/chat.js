const socket = io()

//Elements
const $messageForm = document.querySelector('#send-message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('broadcast-message', (msg) => {
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('hh:mm a')
    })

    //Checks for empty strings or strings with only whitespaces
    if (!/^\s*$/.test(msg)) $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('send-message', message, () => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    })
})

const geoLocation = document.querySelector('#send-location').addEventListener('click', (e) => {
    if (!navigator.geolocation)return alert('Geolocation is not suppported by your browser')
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('send-geo', {
            lat: position.coords.latitude, 
            long: position.coords.longitude
        }, (err) => {
            if(err){
                $locationButton.removeAttribute('disabled')
                return alert(err)
            }
            $locationButton.removeAttribute('disabled')
        })
    })

})