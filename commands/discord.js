module.exports = {
    avatar: function (message) {
        message.reply('This is your avatar: ' + message.author.avatarURL);
    },
    ban: function (message) {
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
    },
    kick: function (message) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                if (member.hasPermission('KICK_MEMBERS')) {
                    member.kick('Check the moderator\'s reason in chat').then(() => {
                        message.reply(`Successfully kicked ${user.tag}`);
                    }).catch(err => {
                        message.reply('Failed to kick the member');
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
    },
    nick: function (args, message) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                if (member.hasPermission('MANAGE_NICKNAMES')) {
                    member.setNickname(args[2]).then(() => {
                        message.reply(`Successfully nicknamed ${user.tag}`);
                    }).catch(err => {
                        message.reply('Failed to nickname the member');
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