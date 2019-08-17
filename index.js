const Discord = require('discord.js');
const mysql = require('mysql');

const credentials = require('./credentials.json');

const discord = require('./commands/discord');
const fun = require('./commands/fun');
const integrations = require('./commands/integrations');
const productivity = require('./commands/productivity');
const utility = require('./commands/utility');

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Connected');
    console.log('Ready!');
});

client.login(credentials.bot_token);

var con = mysql.createConnection({
    host: 'localhost',
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'XBot'
});

var sql;

client.on('guildCreate', guild => {
    sql = 'INSERT INTO servers (id, prefix, disabled) VALUES (\'' + guild.id + '\', \'!xb\', \'\')';
    con.query(sql, function (err) {
        if (err) throw err;
    });
});

client.on('guildDelete', guild => {
    sql = 'DELETE FROM servers WHERE id = \'' + guild.id + '\'';
    con.query(sql, function (err) {
        if (err) throw err;
    });
});

client.on('message', message => {
    if (!message.guild) return;
    sql = 'SELECT prefix, disabled FROM servers WHERE id = \'' + message.guild.id + '\'';
    con.query(sql, function (err, result) {
        if (err) throw err;
        var pref = result[0].prefix;
        var disabled_string = result[0].disabled;
        var disabled = disabled_string.split(' ');
        var commands = {
            avatar: 1,
            ban: 1,
            kick: 1,
            nick: 1,
            ping: 1,
            slap: 1,
            dict: 1,
            imgur: 1,
            maps: 1,
            reddit: 1,
            translate: 1,
            twitch: 1,
            urban: 1,
            yt: 1,
            base: 1,
            calc: 1,
            color: 1,
            currency: 1,
            hash: 1,
            roman: 1,
            help: 1,
            prefix: 1
        };
        for (var i = 0; i < disabled.length; ++i) {
            commands[disabled[i]] = 0;
        }
        if (message.content.startsWith(pref)) {
            var args = message.content.substring(pref.length + 1).split(' ');
            switch (args[0]) {
                case 'avatar':
                    if (commands.avatar) {
                        discord.avatar(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'ban':
                    if (commands.ban) {
                        discord.ban(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'kick':
                    if (commands.kick) {
                        discord.kick(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'nick':
                    if (commands.nick) {
                        discord.nick(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'ping':
                    if (commands.ping) {
                        fun.ping(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'dict':
                    if (commands.dict) {
                        integrations.dict(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'maps':
                    if (commands.maps) {
                        integrations.maps(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'reddit':
                    if (commands.reddit) {
                        integrations.reddit(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'translate':
                    if (commands.translate) {
                        integrations.translate(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'twitch':
                    if (commands.twitch) {
                        integrations.twitch(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'urban':
                    if (commands.urban) {
                        integrations.urban(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'yt':
                    if (commands.yt) {
                        integrations.yt(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'base':
                    if (commands.base) {
                        productivity.base(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'color':
                    if (commands.color) {
                        productivity.color(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'currency':
                    if (commands.currency) {
                        productivity.currency(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'hash':
                    if (commands.hash) {
                        productivity.hash(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'roman':
                    if (commands.roman) {
                        productivity.roman(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'disable':
                    utility.disable(args, message, con, disabled_string);
                    break;
                case 'enable':
                    utility.enable(args, message, con, disabled_string);
                    break;
                case 'help':
                    if (commands.help) {
                        utility.help(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'prefix':
                    if (commands.prefix) {
                        utility.prefix(args, message, con);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                default:
                    message.channel.send('Invalid Syntax!');
            }
        }
    });
});