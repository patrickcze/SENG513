var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

var messages = [];
var users = {};
var connections = [];

// listen to 'chat' messages
io.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length)

    socket.emit('firstUserID', users.length + 1);

    socket.emit('chatHistory', {
        chatHistory: messages
    });

    //Handle disconnection
    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket, 1));
        console.log('Disconnected: %s sockets connected', connections.length)
    });

    socket.on('chat', function (msg) {
        var timestamp = new Date();
        var timeString = timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();

        msg.timeString = timeString;

        messages.push(msg);

        console.log(messages);

        io.emit('chat', msg);
    });
});