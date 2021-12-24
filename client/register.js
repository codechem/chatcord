async function register(event) {
  event.preventDefault();

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: event.target.username.value,
      password: event.target.password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = `/select-room.html?sessionId=${data.sessionId}`;
    });
}
