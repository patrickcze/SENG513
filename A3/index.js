var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen(port, function () {
    print('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

var messages = [];
var users = {};
var connections = [];

var count = 0;

// listen to 'chat' messages
io.on('connection', function (socket) {
    connections.push(socket);
    print('Connected: %s sockets connected', connections.length)

    socket.emit('currentUsers', users);

    count += 1;
    var id = count;

    users[count] = {
        id: count,
        nick: '' + count,
        color: "#000000"
    }

    socket.emit('connectUserDetails', users[id]);

    print(users);

    io.emit('newUserConnected', users[id]);

    socket.emit('chatHistory', {
        chatHistory: messages
    });

    //Handle disconnection
    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket, 1));
        print('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('chat', function (msg) {
        var timestamp = new Date();
        var timeString = timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();

        msg.timeString = timeString;

        print(msg.msg.indexOf('/nick'))
        print(msg.msg.indexOf('/nickcolor'))

        if (msg.msg.indexOf('/nickcolor') !== -1) {
            print('/nickcolor Command')

            var tempuser = users[msg.user.id];

            if (tempuser != null) {
                var tempColor = '#' + msg.msg.replace('/nickcolor ', '').trim();
                tempuser.color = tempColor;

                users[msg.user.id] = tempuser;
                print(users);
            }
            print(tempuser);
            io.emit('updateUser', tempuser);

        } else if (msg.msg.indexOf('/nick') !== -1) {
            print('/nick Command')

            print(checkForUniqueNick(msg));

            var result = checkForUniqueNick(msg);
            if (result.isUnique) {
                //Username is unique need to update everyone
                var tempuser = users[msg.user.id];

                if (tempuser != null) {
                    tempuser.nick = result.nickname;

                    users[msg.user.id] = tempuser;

                    print(users);
                }
                print(tempuser);
                io.emit('updateUser', tempuser);
            } else {
                //Username is not unique need to pass error back to the client
            }
        } else {
            print('normal text message')

            messages.push(msg);
            print(messages);
            io.emit('chat', msg);
        }
    });
});

function print(any) {
    console.log("Server:", any);
}

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