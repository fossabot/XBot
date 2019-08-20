const mysql = require('mysql');

module.exports = {
    disable: function (args, message, con, disabled_string, commands) {
        if (args.length != 2) {
            message.channel.send('Invalid Syntax! Try:\n`disable {command}` to disable a command');
        } else if (args[1].toLowerCase() == 'enable' || args[1] == 'disable') {
            message.channel.send('`enable` and `disable` can\'t be disabled!');
        } else if (!Object.prototype.hasOwnProperty.call(commands, args[1])) {
            message.channel.send('Please enter a valid command!');
        } else if (message.member.hasPermission('MANAGE_GUILD')) {
            if (!disabled_string.includes(args[1])) {
                var sql = 'UPDATE ?? SET disabled = ? WHERE id = ?';
                var inserts = ['servers', disabled_string + args[1], message.guild.id];
                sql = mysql.format(sql, inserts);
                con.query(sql, function (err) {
                    if (err) throw err;
                    message.channel.send('Succesfully disabled:\n`' + args[1] + '`');
                });
            } else {
                message.channel.send('This command is already disabled!');
            }
        } else {
            message.channel.send('You don\'t have the necessary permissions!');
        }
    },
    enable: function (args, message, con, disabled_string, commands) {
        if (args.length != 2) {
            message.channel.send('Invalid Syntax! Try:\n`enable {command}` to enable a command');
        } else if (args[1].toLowerCase() == 'enable' || args[1] == 'disable') {
            message.channel.send('`enable` and `disable` can\'t be enabled!');
        } else if (!Object.prototype.hasOwnProperty.call(commands, args[1])) {
            message.channel.send('Please enter a valid command!');
        } else if (message.member.hasPermission('MANAGE_GUILD')) {
            if (disabled_string.includes(args[1])) {
                disabled_string = disabled_string.replace(args[1], '');
                disabled_string = disabled_string.replace(/\s+/g, ' ');
                var sql = 'UPDATE ?? SET disabled = ? WHERE id =  ?';
                var inserts = ['servers', disabled_string, message.guild.id];
                sql = mysql.format(sql, inserts);
                con.query(sql, function (err) {
                    if (err) throw err;
                    message.channel.send('Succesfully enabled:\n`' + args[1] + '`');
                });
            } else {
                message.channel.send('This command is not disabled!');
            }
        } else {
            message.channel.send('You don\'t have the necessary permissions!');
        }
    },
    help: function (args, message) {
        if (args.length > 1) {
            message.channel.send('Invalid Syntax! Try:\n`help` to display the list of commands');
        } else {
            message.channel.send('TODO');
        }
    },
    prefix: function (args, message, con) {
        if (args.length < 2) {
            message.channel.send('Invalid Syntax! The new prefix is missing. Try:\n`prefix {new prefix}` to change the prefix');
        } else if (message.member.hasPermission('MANAGE_GUILD')) {
            args.splice(0, 1);
            var s = args.join(' ');
            var sql = 'UPDATE ?? SET prefix = ? WHERE id = ?';
            var inserts = ['servers', s, message.guild.id];
            sql = mysql.format(sql, inserts);
            con.query(sql, function (err) {
                if (err) throw err;
            });
            message.channel.send('Changed prefix to:\n`' + s + '`');
        } else {
            message.channel.send('You don\'t have the necessary permissions!');
        }
    }
};