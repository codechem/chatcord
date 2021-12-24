
exports.seed = async function(knex) {
  await Promise.all([
      knex('messages').del(),
      knex('channels').del(),
      knex('users') .del()
  ]);

  await knex('channels').insert([
    { id: 1, name: "General" },
    { id: 2, name: "Dev" },
    { id: 3, name: "Hunger Games" },
  ]);

  await knex('users').insert([
    { id: 1, username: "ilija", password: 'f0bcc809f64dbfb47f1207bdde25d540d7fdb9a437ed2134a7bdd806378a7571' },
    { id: 2, username: "andrej", password: 'f0bcc809f64dbfb47f1207bdde25d540d7fdb9a437ed2134a7bdd806378a7571' },
  ]);
};
