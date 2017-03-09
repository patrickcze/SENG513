// shorthand for $(document).ready(...)
$(function () {
    var socket = io();

    allCookies = document.cookie;

    var cookieID = getCookie("chattrid");

    if (cookieID != null) {
        socket.emit('setupUser', cookieID);
    } else {
        socket.emit('setupUser', null);
    }

    socket.emit('setupUser', null);

    var clientID = "";
    var user;

    var connectedUsers = {}

    $('form').submit(function () {
        socket.emit('chat', {
            msg: $('#m').val(),
            user: user
        });
        $('#m').val('');
        return false;
    });

    socket.on('chat', function (data) {
        $('#messages').append($('<li class="msg-user-id-' + data.user.id + '">').text(data.timeString + "\t-\t" + data.user.nick + ": " + data.msg));

        $('.msg-user-id-' + data.user.id).css({
            "color": data.user.color
        });

        //bold the logged in user messages
        $('.msg-user-id-' + user.id).css({
            "font-weight": "bold"
        });
    });

    socket.on('chatHistory', function (data) {
        for (i in data.chatHistory) {
            var msg = data.chatHistory[i]
            $('#messages').append($('<li class="msg-user-id-' + msg.user.id + '">').text(msg.timeString + "\t-\t" + msg.user.nick + ": " + msg.msg));

            $('.msg-user-id-' + msg.user.id).css({
                "color": msg.user.color
            });
        }
    });

    socket.on('connectUserDetails', function (data) {
        console.log(data);
        clientID = data.id;
        user = data;

        document.cookie = "chattrid=" + clientID;

        $('#usernameTitle').text("Your user name is: " + user.nick);

        print($('.msg-user-id-' + data.id).text());
    });

    socket.on('currentUsers', function (users) {
        connectedUsers = users;

        for (i in connectedUsers) {
            console.log(connectedUsers[i]);
            connectNewUser(connectedUsers[i]);
        }
    });

    socket.on('newUserConnected', function (user) {
        console.log('newUserConnected');
        connectedUsers[user.id] = user;
        console.log(connectedUsers);
        connectNewUser(user);
    });

    socket.on('updateUser', function (data) {
        connectedUsers[data.id] = data;

        if (data.id == user.id) {
            user = data;
            $('#usernameTitle').text("Your user name is: " + data.nick);
        }

        print(connectedUsers);

        $('#user-nick-id-' + data.id).text(data.nick);

        print(user);

        $('.msg-user-id-' + data.id).css({
            "color": data.color
        });
    });

    socket.on('userDisconnect', function (id) {
        delete connectedUsers[id];

        print("User disconnect");
        print(connectedUsers);
        $('#user-nick-id-' + id).remove();
    });

    function connectNewUser(user) {
        $('#onlineUsers').append($('<li id="user-nick-id-' + user.id + '">').text(user.nick));
    }
});

function print(any) {
    console.log("Local:", any);
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}