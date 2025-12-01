// TODO: Remove this in the future
const { io } = require('socket.io-client');

const URL = process.env.URL || 'http://localhost:3000';
const USER_ID = process.env.USER_ID || '000000000000000000000000'; // set a real user id via env for full success

// Allow polling fallback — some environments block websocket upgrades.
const socket = io(URL, { transports: ['polling', 'websocket'], reconnectionAttempts: 5, timeout: 5000 });

socket.on('connect', () => {
   //console.log('connected as', socket.id);
  const payload = {
    user_id: USER_ID,
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 5,
  };
  //console.log('sending send_gps', payload);
  socket.emit('send_gps', payload);
});

socket.on('location_ack', (msg) => {
  //console.log('location_ack', msg);
  // disconnect after ack
  setTimeout(() => socket.disconnect(), 500);
});

socket.on('location_update', (p) => {
  //console.log('location_update (broadcast)', p);
});

socket.on('location_error', (err) => {
  console.error('location_error', err);
  setTimeout(() => socket.disconnect(), 500);
});

socket.on('connect_error', (err) => {
  console.error('connect_error:', err && err.message ? err.message : err);
  if (err && err.detail) console.error('detail:', err.detail);
});

socket.on('reconnect_attempt', (n) => //console.log('reconnect attempt', n));
socket.on('reconnect_failed', () => console.error('reconnect failed')));

process.on('SIGINT', () => {
  socket.disconnect();
  process.exit();
});
