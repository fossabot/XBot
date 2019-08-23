const mysql = require('mysql');

module.exports = {
  disable (args, message, con, disabledString, commands) {
    args[1] = args[1].toLowerCase();
    if (args.length != 2)
      message.channel.send('Invalid Syntax! Try:\n`disable {command}` to disable a command');
    else if (args[1] == 'enable' || args[1] == 'disable')
      message.channel.send('`enable` and `disable` can\'t be disabled!');
    else if (!Object.prototype.hasOwnProperty.call(commands, args[1]))
      message.channel.send('Please enter a valid command!');
    else if (message.member.hasPermission('MANAGE_GUILD'))
      if (disabledString.includes(args[1])) {
        message.channel.send('This command is already disabled!');
      } else {
        let sql = 'UPDATE ?? SET disabled = ? WHERE id = ?';
        const inserts = ['servers', disabledString + args[1], message.guild.id];
        sql = mysql.format(sql, inserts);
        con.query(sql, (err) => {
          if (err) throw err;
          message.channel.send(`Succesfully disabled:\n\`${args[1]}\``);
        });
      }
    else message.channel.send('You don\'t have the necessary permissions!');
  },
  enable (args, message, con, disabledString, commands) {
    args[1] = args[1].toLowerCase();
    if (args.length != 2)
      message.channel.send('Invalid Syntax! Try:\n`enable {command}` to enable a command');
    else if (args[1] == 'enable' || args[1] == 'disable')
      message.channel.send('`enable` and `disable` can\'t be enabled!');
    else if (!Object.prototype.hasOwnProperty.call(commands, args[1]))
      message.channel.send('Please enter a valid command!');
    else if (message.member.hasPermission('MANAGE_GUILD'))
      if (disabledString.includes(args[1])) {
        let disabledStr = disabledString;
        disabledStr = disabledStr.replace(args[1], '');
        disabledStr = disabledStr.replace(/\s+/gu, ' ');
        let sql = 'UPDATE ?? SET disabled = ? WHERE id =  ?';
        const inserts = ['servers', disabledStr, message.guild.id];
        sql = mysql.format(sql, inserts);
        con.query(sql, (err) => {
          if (err) throw err;
          message.channel.send(`Succesfully enabled:\n\`${args[1]}\``);
        });
      } else {
        message.channel.send('This command is not disabled!');
      }
    else message.channel.send('You don\'t have the necessary permissions!');
  },
  help (args, message) {
    if (args.length > 1)
      message.channel.send('Invalid Syntax! Try:\n`help` to display the list of commands');
    else message.channel.send('TODO');
  },
  prefix (args, message, con) {
    if (args.length < 2) {
      message.channel.send('Invalid Syntax! The new prefix is missing. Try:\n`prefix {new prefix}` to change the prefix');
    } else if (message.member.hasPermission('MANAGE_GUILD')) {
      args.splice(0, 1);
      const s = args.join(' ');
      let sql = 'UPDATE ?? SET prefix = ? WHERE id = ?';
      const inserts = ['servers', s, message.guild.id];
      sql = mysql.format(sql, inserts);
      con.query(sql, (err) => {
        if (err) throw err;
      });
      message.channel.send(`Changed prefix to:\n\`${s}\``);
    } else {
      message.channel.send('You don\'t have the necessary permissions!');
    }
  },
};
