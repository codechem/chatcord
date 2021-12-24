const { knex } = require('knex');

const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite',
  },
  useNullAsDefault: true,
});

module.exports = {
  connection,
  db: {
    users: () => connection('users'),
    messages: () => connection('messages'),
    channels: () => connection('channels'),
    servers: () => connection('servers'),
    sessions: () => connection('sessions'),
  },
};
