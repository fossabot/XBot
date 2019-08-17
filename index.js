const Discord = require('discord.js');
const mysql = require('mysql');

const credentials = require('./credentials.json');

const currency = require('./productivity/currency_converter');
const base = require('./productivity/base_converter');
const hash = require('./productivity/hash');
const roman = require('./productivity/roman_converter');
const color = require('./productivity/color_converter');

const kick = require('./discord/kick');
const avatar = require('./discord/avatar');
const ban = require('./discord/ban');
const nick = require('./discord/nick');

const youtube = require('./integrations/youtube');
const reddit = require('./integrations/reddit');
const yandex = require('./integrations/translate');
const maps = require('./integrations/maps');
const urban = require('./integrations/urban');
const dict = require('./integrations/dictionary');
const twitch = require('./integrations/twitch');

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
        var [can_ping, can_help, can_currency, can_base, can_hash, can_roman, can_color, can_kick, can_avatar, can_ban, can_nick, can_yt, can_reddit, can_translate, can_maps, can_urban, can_dict, can_twitch, can_prefix, can_disable, can_enable] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        for (var i = 0; i < disabled.length; ++i) {
            switch (disabled[i]) {
                case 'ping':
                    can_ping = 0;
                    break;
                case 'help':
                    can_help = 0;
                    break;
                case 'currency_convert':
                    can_currency = 0;
                    break;
                case 'base_convert':
                    can_base = 0;
                    break;
                case 'hash':
                    can_hash = 0;
                    break;
                case 'roman_convert':
                    can_roman = 0;
                    break;
                case 'color_convert':
                    can_color = 0;
                    break;
                case 'kick':
                    can_kick = 0;
                    break;
                case 'avatar':
                    can_avatar = 0;
                    break;
                case 'ban':
                    can_avatar = 0;
                    break;
                case 'nick':
                    can_nick = 0;
                    break;
                case 'yt_search':
                    can_yt = 0;
                    break;
                case 'reddit':
                    can_reddit = 0;
                    break;
                case 'translate':
                    can_translate = 0;
                    break;
                case 'maps':
                    can_maps = 0;
                    break;
                case 'urban_dict':
                    can_urban = 0;
                    break;
                case 'dict':
                    can_dict = 0;
                    break;
                case 'twitch':
                    can_twitch = 0;
                    break;
                case 'prefix':
                    can_prefix = 0;
                    break;
                case 'disable':
                    can_disable = 0;
                    break;
                case 'enable':
                    can_enable = 0;
                    break;
            }
        }
        if (message.content.startsWith(pref)) {
            var args = message.content.substring(pref.length + 1).split(' ');
            var cmd = args[0];
            switch (cmd) {
                case 'ping':
                    if (can_ping) {
                        message.channel.send('pong');
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'help':
                    if (can_help) {
                        message.channel.send('Hi! I am XBot! This is what I can do:\ncurrency_convert: Converts values from one currency to another:\n```* currency_convert [value(FLOAT)] [fromCurerency(3 LETTER STRING)] [toCurrency(3 LETTER STRING)] ```\nbase_convert: Converts values from one base to another:\n```* base_convert [value(INT)] [fromBase(2<=INT<=32)] [toBase(2<=INT<=32)]\n```\n```* base_convert [value(INT)] [fromBase(STRING={BIN,OCT,DEC,HEX})] [toBase(STRING={BIN,OCT,DEC,HEX})]```\nhash: Hashes input using md5, sha1, and sha256:\n```hash [input(STRING)]```\nroman_convert: Works both ways:\n```* roman_convert [DECIMAL_NUMBER|ROMAN_NUMBER]\n```\ncolor_convert: Converts color values between HEX and RBG. Works both ways:\n```* color_convert [HEX(#000000)|RGB((0,0,0)) Value] [HEX|RGB] to [HEX|RGB]```');
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'currency_convert':
                    if (can_currency) {
                        currency.currency_convert(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'base_convert':
                    if (can_base) {
                        base.base_convert(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'hash':
                    if (can_hash) {
                        hash.hash(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'roman_convert':
                    if (can_roman) {
                        roman.roman_converter(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'color_convert':
                    if (can_color) {
                        color.color_convert(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'kick':
                    if (can_kick) {
                        kick.kick(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'avatar':
                    if (can_avatar) {
                        avatar.avatar(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'ban':
                    if (can_ban) {
                        ban.ban(message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'nick':
                    if (can_nick) {
                        nick.nick(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'yt_search':
                    if (can_yt) {
                        youtube.search(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'reddit':
                    if (can_reddit) {
                        reddit.reddit(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'translate':
                    if (can_translate) {
                        yandex.translate(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'maps':
                    if (can_maps) {
                        maps.maps(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'urban_dict':
                    if (can_urban) {
                        urban.urban(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'dict':
                    if (can_dict) {
                        dict.dictionary(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'twitch':
                    if (can_twitch) {
                        twitch.twitch(args, message);
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'prefix':
                    if (can_prefix) {
                        if (message.member.hasPermission('MANAGE_GUILD')) {
                            sql = 'UPDATE servers SET prefix = \'' + args[1] + '\' WHERE id = \'' + message.guild.id + '\'';
                            con.query(sql, function (err) {
                                if (err) throw err;
                            });
                            message.channel.send('Changed prefix to: `' + args[1] + '`');
                        } else {
                            message.channel.send('You don\'t have the necessary permissions!');
                        }
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'disable':
                    if (can_disable) {
                        if (args[1] == 'enable' || args[1] == 'disable') {
                            message.channel.send('`enable` and `disable` can\'t be disabled!');
                        } else if (message.member.hasPermission('MANAGE_GUILD')) {
                            if (!disabled_string.includes(args[1])) {
                                sql = 'UPDATE servers SET disabled = \'' + disabled_string + args[1] + ' \' WHERE id = \'' + message.guild.id + '\'';
                                con.query(sql, function (err) {
                                    if (err) throw err;
                                    message.channel.send('Succesfully disabled: `' + args[1] + '`');
                                });
                            } else {
                                message.channel.send('This command is already disabled!');
                            }
                        } else {
                            message.channel.send('You don\'t have the necessary permissions!');
                        }
                    } else {
                        message.channel.send('This command is disabled!');
                    }
                    break;
                case 'enable':
                    if (can_enable) {
                        if (args[1] == 'enable' || args[1] == 'disable') {
                            message.channel.send('`enable` and `disable` can\'t be enabled!');
                        } else if (message.member.hasPermission('MANAGE_GUILD')) {
                            if (disabled_string.includes(args[1])) {
                                disabled_string = disabled_string.replace(args[1], '');
                                disabled_string = disabled_string.replace(/\s+/g, ' ');
                                sql = 'UPDATE servers SET disabled = \'' + disabled_string + '\' WHERE id = \'' + message.guild.id + '\'';
                                con.query(sql, function (err) {
                                    if (err) throw err;
                                    message.channel.send('Succesfully enabled: `' + args[1] + '`');
                                });
                            } else {
                                message.channel.send('This command is not disabled!');
                            }
                        } else {
                            message.channel.send('You don\'t have the necessary permissions!');
                        }
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