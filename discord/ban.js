module.exports = {
    ban: function (message) {
        if (!message.guild) return;
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                if (member.hasPermission('BAN_MEMBERS')) {
                    member.ban({
                        reason: 'Check the moderator\'s reason in chat',
                    }).then(() => {
                        message.reply(`Successfully banned ${user.tag}`);
                    }).catch(err => {
                        message.reply('Failed to ban the member');
                        console.error(err);
                    });
                } else {
                    message.reply('You don\'t have the necessary permissions');
                }
            } else {
                message.reply('That user is not in this server');
            }
        } else {
            message.reply('There is no user mentioned');
        }
    }
};