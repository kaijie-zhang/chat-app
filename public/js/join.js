const socket = io()

// Elements
const $selectRoom = document.querySelector('#select-room')

socket.on('roomsList', ( rooms ) => {

    console.log(rooms)
    for (const room of rooms){
        console.log(room)
        $("#select-room").append("<option value='" + room + "'>")
    }
})