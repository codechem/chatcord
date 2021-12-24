const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const formatMessage = require('./utils/messages');
const {
  getChannels,
  sendMessageToChannel,
  getMessagesInChannel,
} = require('./lib/messages');
const { login, authenticateSession, register } = require('./lib/auth');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

const PORT = 3000;

// Ruta da gi zememe site poraki u odreden kanal
app.get('/messagesInChannel', async (req, res) => {
  const messagesInChannel = await getMessagesInChannel(
    parseInt(req.query.room)
  );

  res.json(messagesInChannel);
});

// Ruta da ja validirame sesijata na korisnikot
app.get('/whoami', async (req, res) => {
  try {
    const session = await authenticateSession(req.query.sessionId);
    res.json(session);
  } catch (err) {
    res.statusCode = 401;
    res.json({ error: "Not logged in" });
  }
});

// Ruta za logiranje
app.post('/login', async (req, res) => {
  try {
    const response = await login(req.body.username, req.body.password);
    res.json({ sessionId: response });
  } catch(err) {
    res.statusCode = 401;
    res.json({ error: "Invalid username or password" });
  }
});

// Ruta za registriranje
app.post('/register', async (req, res) => {
  try {
    const response = await register(req.body.username, req.body.password);
    res.json({ sessionId: response });
  } catch (err) {
    res.json({ error: "User already exists" });
  }
});

// Ruta da gi zememe site kanali
app.get('/channels', async (req, res) => {
  const channels = await getChannels();

  res.json(channels);
});

// Koga nov korisnik ke se konektira, ke se izvrsi sledniot kod
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
  });

  // Emituvame poraka na socketot na front-end pri diskonektiranje na socketot
  socket.on('disconnect', () => {
    console.log('User has left.');
  });

  // Slusame za sendMessage od front-end
  socket.on('sendMessage', async (message, user, room) => {
    // I vrati ja porakata na site ostanati socketi vo toj specificen **kanal**
    io.to(room).emit('message', formatMessage(user.username, message));

    // Zacuvaj ja porakata vo baza
    await sendMessageToChannel(room, user.user, message);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}. http://0.0.0.0:3000`);
});
