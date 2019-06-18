const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString')
const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log("A new user just conneced");


    socket.on('join', (params, callback) => {
        if(!isRealString(params.room) || !isRealString(params.room)){
            callback('Name and room are required');
        }

        socket.join(params.room);


            socket.emit('newMessage', 
            generateMessage('Admin', 'Welcome to the chat room!')
        );

        socket.broadcast.emit('newMessage', 
            generateMessage('Admin', 'New user joined')
        );

        callback();
    })



    socket.on('createMessage', (message, callback) =>{
        console.log("createMessage", message);
        // broadcast to everyone include me
        io.emit('newMessage', 
            generateMessage(message.from, message.text));
        
        callback("This is the server:");
        
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', `${coords.lat}, ${coords.lng}`))
    })

    socket.on('disconnect', () =>{
        console.log('A user was disconnected from server.');
    });
    
    
})


server.listen(port, ()=>{ 
    console.log(`Server is up on port ${port}`); 

});