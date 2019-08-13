module.exports = {
    kick: function (args, message) {
        if (!message.guild) return;
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member.kick('Check the moderator\'s reason in chat').then(() => {
                    message.reply(`Successfully kicked ${user.tag}`);
                }).catch(err => {
                    message.reply('Failed to kick the member');
                    console.error(err);
                });
            } else {
                message.reply('That user is not in this server');
            }
        } else {
            message.reply('There is no user mentioned');
        }
    }
}