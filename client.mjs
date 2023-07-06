import { io } from 'socket.io-client'
// const { io } = require('socket.io-client');

const socket = io('http://localhost:8080');

// client-side

socket.on('new user', (msg) => {
  console.log('new user');
  console.log(msg);
});
socket.on('new message', (msg) => {
  let msgObj = JSON.parse(msg);
  if (msgObj.sender == socket.id) return;
  console.log('new message');
  console.log(msgObj.message);
});

socket.on('disconnect', () => {
  console.log('[disconnect]');
});

socket.on('connect', () => {
  console.log('[connect] id:', socket.id);
  socket.emit('joinRoom', JSON.stringify(msgObj));
});

let msgObj = {
  roomId: "room_001",
}
// socket.emit('joinRoom', JSON.stringify(msgObj));

msgObj.message = "hello"
msgObj.sender = socket.id
socket.emit('new message', JSON.stringify(msgObj));
