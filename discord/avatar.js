module.exports = {
    avatar: function (message) {
        message.reply('This is your avatar: ' + message.author.avatarURL);
    }
}