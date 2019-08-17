const Discord = require('discord.js');
const mysql = require('mysql');

const auth = require('./auth.json');
const mysql_auth = require('./mysql_auth.json');

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

client.login(auth.token);

var con = mysql.createConnection({
    host: 'localhost',
    user: mysql_auth.user,
    password: mysql_auth.password,
    database: 'XBot'
});

var sql;

client.on('guildCreate', guild => {
    sql = 'INSERT INTO servers (id, prefix) VALUES (\'' + guild.id + '\', \'!xb\')';
    con.query(sql, function (err) {
        if (err) throw err;
        console.log('1 record inserted');
    });
});

client.on('guildDelete', guild => {
    sql = 'DELETE FROM servers WHERE id = \'' + guild.id + '\'';
    con.query(sql, function (err) {
        if (err) throw err;
        console.log('1 record deleted');
    });
});

client.on('message', message => {
    sql = 'SELECT prefix FROM servers WHERE id = \'' + message.guild.id + '\'';
    con.query(sql, function (err, result) {
        if (err) throw err;
        var pref = result[0].prefix;
        if (message.content.startsWith(pref)) {
            var args = message.content.substring(pref.length + 1).split(' ');
            var cmd = args[0];
            switch (cmd) {
                case 'ping':
                    message.channel.send('pong');
                    break;
                case 'help':
                    message.channel.send('Hi! I am XBot! This is what I can do:\ncurrency_convert: Converts values from one currency to another:\n```* currency_convert [value(FLOAT)] [fromCurerency(3 LETTER STRING)] [toCurrency(3 LETTER STRING)] ```\nbase_convert: Converts values from one base to another:\n```* base_convert [value(INT)] [fromBase(2<=INT<=32)] [toBase(2<=INT<=32)]\n```\n```* base_convert [value(INT)] [fromBase(STRING={BIN,OCT,DEC,HEX})] [toBase(STRING={BIN,OCT,DEC,HEX})]```\nhash: Hashes input using md5, sha1, and sha256:\n```hash [input(STRING)]```\nroman_convert: Works both ways:\n```* roman_convert [DECIMAL_NUMBER|ROMAN_NUMBER]\n```\ncolor_convert: Converts color values between HEX and RBG. Works both ways:\n```* color_convert [HEX(#000000)|RGB((0,0,0)) Value] [HEX|RGB] to [HEX|RGB]```');
                    break;
                case 'currency_convert':
                    currency.currency_convert(args, message);
                    break;
                case 'base_convert':
                    base.base_convert(args, message);
                    break;
                case 'hash':
                    hash.hash(args, message);
                    break;
                case 'roman_convert':
                    roman.roman_converter(args, message);
                    break;
                case 'color_convert':
                    color.color_convert(args, message);
                    break;
                case 'kick':
                    kick.kick(message);
                    break;
                case 'avatar':
                    avatar.avatar(message);
                    break;
                case 'ban':
                    ban.ban(message);
                    break;
                case 'nick':
                    nick.nick(args, message);
                    break;
                case 'yt_search':
                    youtube.search(args, message);
                    break;
                case 'reddit':
                    reddit.reddit(args, message);
                    break;
                case 'translate':
                    yandex.translate(args, message);
                    break;
                case 'maps':
                    maps.maps(args, message);
                    break;
                case 'urban_dict':
                    urban.urban(args, message);
                    break;
                case 'dict':
                    dict.dictionary(args, message);
                    break;
                case 'twitch':
                    twitch.twitch(args, message);
                    break;
                case 'prefix':
                    sql = 'UPDATE servers SET prefix = \'' + args[1] + '\' WHERE prefix = \'' + pref + '\'';
                    con.query(sql, function (err) {
                        if (err) throw err;
                        console.log('1 record updated');
                    });
                    message.channel.send('Changed prefix to: `' + args[1] + '`');
                    break;
                default:
                    message.channel.send('Invalid Syntax!');
            }
        }
    });
});