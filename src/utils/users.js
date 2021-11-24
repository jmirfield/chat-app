const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
<<<<<<< HEAD
    username = username.trim()
    room = room.trim()
=======
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
>>>>>>> 9518556 (Added login page and starting to create logic for users)

    if(!username || !room) {
        return {
            error: 'Username and room are required.'
        }
    }

    const existingUser = users.find((user) => user.room === room && user.username === username)
    if(existingUser) {
        return {
            error: 'Username already exists.'
        }
    }

    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1)return users.splice(index, 1)[0]
}



module.exports = {
    addUser,
<<<<<<< HEAD
    removeUser,
    users
=======
    removeUser
>>>>>>> 9518556 (Added login page and starting to create logic for users)
}