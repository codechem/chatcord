async function login(event) {
  event.preventDefault();

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: event.target.username.value,
      password: event.target.password.value,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json().then((data) => {
          throw new Error(data.error);
        })
      }
    })
    .then((data) => {
      window.location.href = `/select-room.html?sessionId=${data.sessionId}`;
    })
    .catch(err => {
      alert(err);
      window.location.href = "/";
    });
}
