let socket = io();

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
  }

socket.on('connect', function(){
    console.log('Connected to server.');

    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"'+decodeURI(searchQuery).replace(/&/g,'","').replace(/\+/g,'" "').replace(/=/g,'":"')+'"}')

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No Error');
            
        }
    })
});

socket.on('disconnect', function(){
    console.log('Disconnected to server.');
});

socket.on("newMessage", function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    const div = document.createElement('div');
    div.innerHTML = html

    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
})


socket.on("newLocationMessage", function (message) {
    console.log("newLocationMessage", message);
    const formattedTime = moment(message.createdAt).format('LT');

    let li = document.createElement('li');
    let a = document.createElement('a');
    li.innerText = `${message.from} ${formattedTime}`;
    a.setAttribute('target', '_blank');
    a.setAttribute('href',message.url);
    a.innerText('My current location');

    li.appendChild(a);

    document.querySelector('body').appendChild(li);
})


document.querySelector('#submit-btn').addEventListener('click', function(e){
    e.preventDefault();

    socket.emit("createMessage", {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, function(){

    })
})


document.querySelector('#send-location').addEventListener('click', function(e){
    console.log(navigator.geolocation);
    if(navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.")
    }


    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
        
    },function () {
        alert("unable to fetch location");
    })
 
});