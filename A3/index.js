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
var connections = [];

var users = {};
var currentUsers = {};

var count = 0;

// listen to 'chat' messages
io.on('connection', function (socket) {
    connections.push(socket);

    socket.emit('currentUsers', currentUsers);

    socket.emit('chatHistory', {
        chatHistory: messages
    });

    socket.on('setupUser', function (data) {
        //Working with Cookies
        if (data != null) {
            //There is no cookie asociated with the user
            var user = users[data];
            var currentUser = currentUsers[data];

            if (user == null) {
                //There was a cookie but no user object was found
                count += 1;
                var id = count;

                //check if someone is using that id as a username
                var uniqueResult = checkForUniqueNickname('' + id);

                //increase id to a higher number and check if unique
                while (uniqueResult.isUnique == false) {
                    count += 1;
                    id = count;
                    uniqueResult = checkForUniqueNickname('' + id);
                }

                users[id] = {
                    id: id,
                    nick: '' + count,
                    color: "#000000"
                }

                currentUsers[id] = {
                    id: id,
                    nick: '' + count,
                    color: "#000000"
                }

                socket.emit('connectUserDetails', users[id]);

                print(users);

                io.emit('newUserConnected', users[id]);
            } else if (currentUser != null) {
                //There was a cookie but the user is already in use
                count += 1;
                var id = count;

                //check if someone is using that id as a username
                var uniqueResult = checkForUniqueNickname('' + id);

                //increase id to a higher number and check if unique
                while (uniqueResult.isUnique == false) {
                    count += 1;
                    id = count;
                    uniqueResult = checkForUniqueNickname('' + id);
                }

                users[id] = {
                    id: id,
                    nick: '' + count,
                    color: "#000000"
                }

                currentUsers[id] = {
                    id: id,
                    nick: '' + count,
                    color: "#000000"
                }

                socket.emit('connectUserDetails', users[id]);

                print(users);

                io.emit('newUserConnected', users[id]);
            } else {
                //There was a cookie and we can set that same user up
                print('Existing user');
                console.log(data);

                print(users);
                print(users[data]);
                currentUsers[data] = user;

                socket.emit('connectUserDetails', user);
                io.emit('newUserConnected', user);
            }
        } else {
            //No cookie create new user
            count += 1;
            var id = count;

            //check if someone is using that id as a username
            var uniqueResult = checkForUniqueNickname('' + id);

            //increase id to a higher number and check if unique
            while (uniqueResult.isUnique == false) {
                count += 1;
                id = count;
                uniqueResult = checkForUniqueNickname('' + id);
            }

            users[id] = {
                id: id,
                nick: '' + count,
                color: "#000000"
            }

            currentUsers[id] = {
                id: id,
                nick: '' + count,
                color: "#000000"
            }

            socket.emit('connectUserDetails', users[id]);

            print(users);

            io.emit('newUserConnected', users[id]);
        }
    });

    //Handle disconnection
    socket.on('disconnect', function (data) {
        let id = connections.indexOf(socket, 1) + 1;
        if (id != 0) {
            delete currentUsers[id];
            io.emit('userDisconnect', id);
        }
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
                currentUsers[msg.user.id] = tempuser;
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
                    currentUsers[msg.user.id] = tempuser;

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

function checkForUniqueNickname(name) {
    let unique = true;
    let newNick = name;

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

function performNormalNewUserConnection(socket) {
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
}