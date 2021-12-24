const { db } = require("./db");

const sendMessageToChannel = (channel, from, content) =>
    db.messages().insert([{
        from,
        content,
        channel
    }]);

const getChannels = async () => {
    return db.channels().select();
};

const getMessagesInChannel = async (channelId) =>
    db.messages().where({
        channel: channelId
    })
    .join("users", "users.id", "=", "from")
    .join("channels", "channels.id", "=", "channel")
    .select('users.username', 'messages.*', 'channels.name as channelName');

module.exports = {
    getChannels,
    getMessagesInChannel,
    sendMessageToChannel,
}