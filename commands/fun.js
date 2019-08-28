module.exports = {
  ping (args, message) {
    if (args.length > 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`ping`**\n  - **to get a "pong" reply**');
    } else {
      message.channel.send('pong');
    }
  },
};
