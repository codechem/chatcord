function formatMessage(username, content) {
  const sent = new Date();
  return {
    username,
    content,
    sent,
  };
}

module.exports = formatMessage;
