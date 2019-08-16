module.exports = {
    nick: function (args, message) {
        if (!message.guild) return;
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member.setNickname(args[2]).then(() => {
                    message.reply(`Successfully nicknamed ${user.tag}`);
                }).catch(err => {
                    message.reply('Failed to nickname the member');
                    console.error(err);
                });
            } else {
                message.reply('That user is not in this server');
            }
        } else {
            message.reply('There is no user mentioned');
        }
    }
};