let express = require('express');
let http = require('http');
let socket = require('socket.io');

const PORT = 3001;

let app = express();
let server = http.createServer(app);

let io = socket(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});

app.get('/', (req, res) => {
  res.send('Working');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ', JSON.stringify(msg));

    socket.broadcast.emit('chat message', msg);
    // io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening in at port ${PORT}`);
});
