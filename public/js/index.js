
let socket = io();

socket.on('connect', function(){
    console.log('Connected to server.');
});

socket.on('disconnect', function(){
    console.log('Disconnected to server.');
});

socket.on("newMessage", function (message) {
    console.log("newMessage", message);
})

socket.emit('createMessage', {
    from: "Samuel",
    text: "Hey, ready to play"
}, function (message) {
    console.log('Got it.', message);
    
})