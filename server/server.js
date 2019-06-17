const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log("A new user just conneced");

    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome to the chat room!",
        createdAt: new Date().getDate()
    })

    socket.broadcast.emit('newMessage', {
        from: "Admin",
        text: "New user joined",
        createdAt: new Date().getTime()
    })



    socket.on('createMessage', (message) =>{
        console.log("createMEssage", message);
        // broadcast to everyone include me
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
        
    });

    socket.on('disconnect', () =>{
        console.log('A user was disconnected from server.');
    });
    
    
})


server.listen(3000, ()=>{ 
    console.log(`Server is up on port ${port}`); 

});