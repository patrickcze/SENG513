// shorthand for $(document).ready(...)
$(function () {
    var socket = io();

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
            $('#messages').append($('<li>').text(msg.timeString + "\t-\t" + msg.user.nick + ": " + msg.msg));
        }
    });

    socket.on('connectUserDetails', function (data) {
        console.log(data);
        clientID = data.id;
        user = data;

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
        user = data;
        print(connectedUsers);

        $('#user-nick-id-' + data.id).text(data.nick);
        $('#usernameTitle').text("Your user name is: " + data.nick);

        print(user);
    });

    function connectNewUser(user) {
        $('#onlineUsers').append($('<li id="user-nick-id-' + user.id + '">').text(user.nick));
    }
});

function print(any) {
    console.log("Local:", any);
}