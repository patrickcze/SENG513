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

var count = 0;

// listen to 'chat' messages
io.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length)

    socket.emit('currentUsers', users);

    count += 1;
    var id = count;

    users[count] = {
        id: count,
        nick: '' + count,
        color: "#000000"
    }

    socket.emit('connectUserDetails', users[id]);

    console.log(users);

    io.emit('newUserConnected', users[id]);

    socket.emit('chatHistory', {
        chatHistory: messages
    });

    //Handle disconnection
    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket, 1));
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('chat', function (msg) {
        var timestamp = new Date();
        var timeString = timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();

        msg.timeString = timeString;

        //Check for special test commands
        // Check for colour change
        if (msg.msg.indexOf('/nickcolor') >= 0) {
            console.log('User is attempting to change nickcolour');
            var tempuser = users[msg.user.id];

            if (tempuser != null) {
                var tempColor = '#' + msg.msg.replace('/nickcolor ', '').trim();
                tempuser.color = tempColor;

                users[msg.user.id] = tempuser;
                console.log(users);
            }
            console.log(tempuser);
            io.emit('updateUser', tempuser);
        }
        //Check for nickname change
        else if (msg.msg.indexOf('nick') >= 0) {
            messages.push(msg);
            console.log(messages);
            io.emit('chat', msg);
        } else {
            console.log('User is attempting to change nick');

            console.log(checkForUniqueNick(msg));

            var result = checkForUniqueNick(msg);
            if (result.isUnique) {
                //Username is unique need to update everyone
                var tempuser = users[msg.user.id];

                if (tempuser != null) {
                    tempuser.nick = result.nickname;

                    users[msg.user.id] = tempuser;

                    console.log(users);
                }
                console.log(tempuser);
                io.emit('updateUser', tempuser);
            } else {
                //Username is not unique need to pass error back to the client
            }
        }
    });

});

function checkForUniqueNick(messageObject) {
    let unique = true;
    let newNick = messageObject.msg.replace('/nick ', '').trim();

    for (i in users) {
        if (users[i].nick === newNick) {
            unique = false;
        }
    }

    return {
        isUnique: unique,
        nickname: newNick
    };
}