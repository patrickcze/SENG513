// shorthand for $(document).ready(...)
$(function () {
    var socket = io();

    var clientID = "Nick";
    var nickname = clientID;

    $('form').submit(function () {
        socket.emit('chat', {
            msg: $('#m').val(),
            nick: nickname
        });
        $('#m').val('');
        return false;
    });

    socket.on('chat', function (data) {
        $('#messages').append($('<li>').text(data.timeString + "\t-\t" + data.nick + ": " + data.msg));
    });

    socket.on('chatHistory', function (data) {
        for (i in data.chatHistory) {
            var msg = data.chatHistory[i]
            $('#messages').append($('<li>').text(msg.timeString + "\t-\t" + msg.nick + ": " + msg.msg));
        }
    });

    socket.on('firstUserID', function (userid) {
        clientID = userid;
        nickname = clientID;
    });
});