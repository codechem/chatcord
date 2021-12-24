const socket = io();
let user = null;

function loadMessagesInChannel(user, room) {
  fetch(`/messagesInChannel?room=${room}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((message) => addMessageToChat(message, user));
    });
}

function sendMessage(event) {
  event.preventDefault();

  const { room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  // Ja zimame porakata od eventot
  const message = event.target.message.value;

  // Emituvame poraka do serverot
  socket.emit('sendMessage', message, user, room);

  // Go resetirame input poleto i povtorno go selektirame input poleto
  event.target.message.value = '';
  event.target.message.focus();
}

function addMessageToChat(message, user) {
  const messageContainer = document.createElement('div');
  const isFromMe = message.username === user.username;

  messageContainer.classList.add('message-container');

  if (!isFromMe) {
    // Ako ne sme nie tie so ja prakjame porakata, dodavame klasa sto kje ja stavi porakata na desnata strana
    messageContainer.classList.add('other-user');
  }

  messageContainer.innerHTML = `
    <div class="username">
    
    </div>
    <div class="message-and-time">
      <div class="message"></div>
      <div class="time">${new Date(message.sent).toLocaleTimeString("mk-MK")}</div>
    </div>
  `;

  messageContainer.querySelector('.message').innerText = message.content;
  messageContainer.querySelector('.username').innerText = `${isFromMe ? 'You' : message.username}`;
  document.querySelector('.chat-box').appendChild(messageContainer);
}

async function main() {
  const chatBox = document.querySelector('.chat-box');
  const { sessionId, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  if (!sessionId) {
    document.body.innerHTML = '<h1>Please provide a sessionId</h1>';
  }

  await whoAmI(sessionId).then((userData) => {
    user = userData;
    // Vlezi vo sobata so soodvetno odbraniot username
    socket.emit('joinRoom', { username: user.username, room });
    loadMessagesInChannel(user, room);
  });

  socket.on('message', (message) => {
    // Ja dodavame poraka vo chatot
    addMessageToChat(message, user);

    // Skrolame do poslednata poraka
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

main();
