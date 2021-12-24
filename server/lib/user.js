const { db } = require("./db");

const getUser = (id) => db.users().where({ id }).select().first();

const getUserByUsername = (username) => db.users().where({username}).select().first();

module.exports = {
    getUser,
    getUserByUsername,
};