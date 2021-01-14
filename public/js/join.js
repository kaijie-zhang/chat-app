const socket = io()

// Elements
const $selectRoom = document.querySelector('#select-room')

socket.on('roomsList', ( rooms ) => {
    console.log($selectRoom)
    console.log(rooms)
    $selectRoom.options
    $selectRoom.options[$selectRoom.options.length] = new Option('','')
    for (roomIndex in rooms){
        console.log(rooms)
        $selectRoom.options[$selectRoom.options.length] = new Option(rooms[roomIndex], rooms[roomIndex])
    }
})