const http = require('http');
const app = require('./express-app');
const socketio = require('socket.io');
const uniqid = require('uniqid');

const port = 8080;
const webServer = http.createServer();
webServer.listen(port, ()=>{
  console.log('web socker server started!');
});
webServer.on('request', app);

const io = socketio(webServer, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log(socket.id, ' connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('joinRoom', (msg) => {
    let msgObj = JSON.parse(msg);
    /*
    *  msgObj example : {
    *    roomId: 'any_room_id_string'
    *  }
    */

    if (msgObj.roomId.length > 0) {
      console.log('id:', socket.id, 'request join room:', msgObj.roomId)
      socket.join(msgObj.roomId);

      // broadcast to everyone in the room
      io.to(msgObj.roomId).emit('new user', 'a new user has joined the room');
    }
  });

  socket.on('new message', (msg) => {
    let msgObj = JSON.parse(msg);
    let roomId = msgObj.roomid;
    console.log('new message')
    io.to(msgObj.roomId).emit('new message', msg);
  });

});
