var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.use("/", express.static(__dirname + "/ZippyCodeFrontend"));

var bridge = require("./bridge.js");
var bridgeZippyServerModule = require("./ZippyCodeServer.js").ZippyCodeModule.ZippyCodeServer;

var Rooms = bridgeZippyServerModule.Rooms;

var ZippyCodeServer = bridgeZippyServerModule.ZippyServer;
ZippyCodeServer.LoadIO(io);

app.get("/", function(req, res)
{
  res.sendFile(__dirname + "/ZippyCodeFrontend/index.html");
});


io.on('connection', function(socket)
{
  socket.compress(true);
  console.log('a user connected');

  socket.on("disconnect", function()
  {
    ZippyCodeServer.UserLeaveRoom(socket, socket.roomId);
  });

  socket.on("UserJoinRoom", function(pUniqueID)
  {
    socket.roomId = pUniqueID;
    ZippyCodeServer.UserJoinRoom(socket, socket.roomId);
  });

  socket.on("ToServerText", function(pText)
  {
    // network the text given here to all other sockets in this room.
    ZippyCodeServer.RoomMessage(socket.roomId, pText);
  });
});


http.listen(1337, function()
{
  console.log('listening on *:1337');
});
