const rooms = []

// addRoom, removeRemove, getRooms

const addRoom = (room) => {
    room = room.trim().toLowerCase()
    if (rooms.indexOf(room) <= -1){
        rooms.push(room)
    }
    
}

const removeRoom = (room) => {
    const index = rooms.indexOf(room)

    if (index > -1){
        return rooms.splice(index, 1)[0]
    }
}

const getRooms = () => {
    return rooms
}

const getOtherRooms = (thisRoom) =>{
    thisRoom = thisRoom.trim().toLowerCase()
    const otherRooms = rooms.filter((room) => room !== thisRoom)
    return otherRooms
}

const roomExists = (room) => {
    return rooms.indexOf(room) > -1
}

module.exports = {
    addRoom,
    removeRoom,
    getRooms,
    roomExists,
    getOtherRooms
}
