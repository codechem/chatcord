
async function whoAmI(sessionId) {
    return await fetch(`/whoami?sessionId=${sessionId}`, {
      method: 'GET',
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
      return data;
    }).catch(err => {
      alert(err);
      window.location.href = "/";
    });
  }