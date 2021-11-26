const socket = io()

//Elements
const $messageForm = document.querySelector('#send-message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild
    const marginHeight = parseInt(getComputedStyle($newMessage).marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + marginHeight
    const visibleHeight = $messages.offsetHeight
    const messageContainerHeight = $messages.scrollHeight
    const currentScroll = $messages.scrollTop + visibleHeight
    if(messageContainerHeight-newMessageHeight <= currentScroll)$messages.scrollTop = $messages.scrollHeight
}

socket.on('broadcast-message', (msg) => {
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('hh:mm a'),
        user: msg.username
    })
    //Checks for empty strings or strings with only whitespaces
    if (!/^\s*$/.test(msg.text)) $messages.insertAdjacentHTML('beforeend', html)
    //$messages.scrollTop = $messages.scrollHeight
    autoScroll()
})

socket.on('roomUpdate', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
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

$locationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation)return alert('Geolocation is not suppported by your browser')
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('send-location', {
            lat: position.coords.latitude, 
            long: position.coords.longitude
        }, (err) => {
            $locationButton.removeAttribute('disabled')
            if(err)return alert(err)
        })
    })

})

if(!username || !room){
    location.href = '/'
} else {
    socket.emit('join-room', { username, room }, (error) => {
        if(error){
            alert(error)
            location.href = '/'
        }
    })
}