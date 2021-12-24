let user = null;

async function fetchRooms() {
  return await fetch(`/channels`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

function selectRoom(event) {
  event.preventDefault();

  const { sessionId } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const roomSelect = document.getElementById('room-select');
  const room = roomSelect.options[roomSelect.selectedIndex].value;

  window.location.href = `/chat.html?sessionId=${sessionId}&room=${room}`;
}

async function main() {
  const { sessionId } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const channels = await fetchRooms();
  const authSelect = document.querySelector('.auth-select');

  if (!sessionId) {
    document.body.innerHTML = '<h1>Please provide a sessionId</h1>';
  }

  await whoAmI(sessionId).then((userData) => {
    user = userData;
  })

  authSelect.innerHTML = `<h3>Hey ${user.username}! Pick a room :)</h3>`;

  const select = document.createElement('select');
  select.id = 'room-select';
  authSelect.append(select);

  channels.forEach((channel) => {
    const option = document.createElement('option');
    option.value = channel.id;
    option.text = channel.name;
    select.appendChild(option);
  });
}

main();
