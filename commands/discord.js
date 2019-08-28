module.exports = {
  avatar (args, message) {
    const user = message.mentions.users.first();
    if (user) {
      message.channel.send(`This is ${user.tag}'s avatar: ${user.avatarURL}`);
    } else if (args.length == 1) {
      message.reply(`This is your avatar: ${message.author.avatarURL}`);
    } else {
      message.channel.send('Invalid Syntax! Try:\n* **`avatar <user mention>`**\n  - **to display a user\'s avatar**\n* **`avatar`**\n  - **to display your own avatar**');
    }
  },
  ban (message) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        if (member.hasPermission('BAN_MEMBERS')) {
          member
            .ban({
              reason: 'Check the moderator\'s reason in chat',
            })
            .then(() => {
              message.reply(`Successfully banned ${user.tag}`);
            })
            .catch(() => {
              message.reply(`Failed to ban ${user.tag}`);
            });
        } else {
          message.reply('You don\'t have the necessary permissions!');
        }
      } else {
        message.reply('That user is not in this server! Try:\n* **`ban <member mention>`**\n  - **to ban a member**');
      }
    } else {
      message.reply('There is no user mentioned! Try:\n* **`ban <member mention>`**\n  - **to ban a member**');
    }
  },
  kick (message) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        if (member.hasPermission('KICK_MEMBERS')) {
          member
            .kick('Check the moderator\'s reason in chat')
            .then(() => {
              message.reply(`Successfully kicked ${user.tag}`);
            })
            .catch(() => {
              message.reply(`Failed to kick ${user.tag}`);
            });
        } else {
          message.reply('You don\'t have the necessary permissions!');
        }
      } else {
        message.reply('That user is not in this server! Try:\n* **`kick <member mention>`**\n  - **to kick a member**');
      }
    } else {
      message.reply('There is no user mentioned! Try:\n* **`kick <member mention>`**\n  - **to kick a member**');
    }
  },
  nick (args, message) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        if (member.hasPermission('MANAGE_NICKNAMES')) {
          member
            .setNickname(args[2])
            .then(() => {
              message.reply(`Successfully nicknamed ${user.tag}`);
            })
            .catch(() => {
              message.reply(`Failed to nickname ${user.tag}`);
            });
        } else {
          message.reply('You don\'t have the necessary permissions!');
        }
      } else {
        message.reply('That user is not in this server! Try:\n* **`nick <member mention> <new nickname>`**\n  - **to nickname a member**');
      }
    } else {
      message.reply('There is no user mentioned! Try:\n* **`nick <member mention> <new nickname>`**\n  - **to nickname a member**');
    }
  },
};
