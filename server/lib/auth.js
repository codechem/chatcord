const { db } = require('./db');
const crypto = require('crypto');
const { getUserByUsername, getUser } = require('./user');

const hashValue = (plaintext) =>
  crypto
    .createHash('sha256', 'ThisIsProbablyUnsafeButOk')
    .update(plaintext)
    .digest('hex');

const randomString = () => {
  return hashValue(new Date().getTime().toString());
};

const verifyHash = (plaintext, hash) => {
  const plainHashed = hashValue(plaintext);
  return plainHashed === hash;
};

const register = async (username, password) => {
  const hashed = hashValue(password);
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw new Error(`User ${username} is already registered`);
  }

  const [id] = await db.users().insert([
    {
      username,
      password: hashed,
    },
  ]);

  return await login(username, password);
};

const login = async (username, password) => {
  const existingUser = await getUserByUsername(username);
  if (!existingUser) {
    throw new Error(`User ${username} does not exist`);
  }

  const isPasswordValid = verifyHash(password, existingUser.password);

  if (!isPasswordValid) {
    throw new Error(`Password for ${username} is invalid`);
  }

  const sessionId = randomString();
  await db.sessions().insert({ sessionId, user: existingUser.id });

  return sessionId;
};

const authenticateSession = async (sessionId) => {
  const session = await db.sessions().where({ sessionId }).select().first();

  if (!session) {
    throw new Error(`Session not found`);
  }

  const user = await getUser(session.user);
  session.username = user.username;

  return session;
};

module.exports = {
  authenticateSession,
  login,
  register,
  verifyHash,
  hashValue,
};
