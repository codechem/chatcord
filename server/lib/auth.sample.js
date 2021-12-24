const { connection } = require('./db');
const { authenticateSession, register, login } = require('./auth');

(async function main() {
  console.log('Register');

  const session = await register(`ilija${new Date().getTime()}`, 'mkoffice');
  console.log(`Session: ${session}`);

  const auth = await authenticateSession(session);
  console.log(auth);

  console.log('LOGIN');
  const loginSession = await login('ilija', 'mkoffice');
  const loginAuth = await authenticateSession(loginSession);
  console.log(loginAuth);
})().then(() => {
  connection.destroy();
});
