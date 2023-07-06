const http = require('http');
// const app = require('./express-app');
const socketio = require('socket.io');
const uniqid = require('uniqid');

const port = 8080;
const webServer = http.createServer(
  (req, res)=>{
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
      res.writeHead(200);
      res.end();
      return;
    }
  }
);
webServer.listen(port, ()=>{
  console.log('web socker server started!');
});
// webServer.on('request', app);

const io = socketio(webServer);

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

  socket.on('client message', function(msg){
    console.log('client message');
    console.log(msg)
    return;
    let msgObj = JSON.parse(msg);
    let roomId = msgObj.roomid;
    let room = io.sockets.adapter.rooms[roomId]
    delete msgObj['roomid']
    if (room == undefined) {
      return
    }
    let roomSockets = room.sockets;
    for (let id in roomSockets) {
      if (id !== socket.id) {
        io.to(id).emit('client msg',  JSON.stringify(msgObj))
      }
    }
    
    // Emit message to all sockets in room
    // io.to(roomId or socketId ).emit('host message', 'host emit message')
  });

  socket.on('host message', function(msg){
    console.log('host message')
    console.log(msg)
    return
    let msgObj = JSON.parse(msg);
    let roomId = msgObj.roomid;
    let room = io.sockets.adapter.rooms[roomId]
    delete msgObj['roomid']
    if (room == undefined) {
      return
    }
    let roomSockets = room.sockets
    for (let id in roomSockets) {
      if (id !== socket.id) {
        io.to(id).emit('host msg', JSON.stringify(msgObj))
      }
    }
  });
});
