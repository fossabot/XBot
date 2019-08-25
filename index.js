/* eslint-disable sort-keys */
const Discord = require('discord.js');
const mysql = require('mysql');

require('dotenv').config();

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

client.login(process.env.BOT_TOKEN);

const con = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'XBot',
});

client.on('guildCreate', (guild) => {
  let sql = 'INSERT INTO ?? (??, ??, ??) VALUES (?, \'!x\', \'\')';
  const inserts = ['servers', 'id', 'prefix', 'disabled', guild.id];
  sql = mysql.format(sql, inserts);
  con.query(sql, (err) => {
    if (err) {
      throw err;
    }
  });
});

client.on('guildDelete', (guild) => {
  let sql = 'DELETE FROM ?? WHERE id = ?';
  const inserts = ['servers', guild.id];
  sql = mysql.format(sql, inserts);
  con.query(sql, (err) => {
    if (err) {
      throw err;
    }
  });
});

client.on('message', (message) => {
  if (!message.guild) {
    return;
  }
  let sql = 'SELECT ??, ?? FROM ?? WHERE id = ?';
  const inserts = ['prefix', 'disabled', 'servers', message.guild.id];
  sql = mysql.format(sql, inserts);
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    const pref = result[0].prefix;
    const disabledString = result[0].disabled;
    const disabled = disabledString.split(' ');
    const commands = {
      avatar: 1,
      ban: 1,
      kick: 1,
      nick: 1,
      ping: 1,
      dict: 1,
      imdb: 1,
      imgur: 1,
      maps: 1,
      reddit: 1,
      stackex: 1,
      translate: 1,
      twitch: 1,
      urban: 1,
      weather: 1,
      yt: 1,
      base: 1,
      calc: 1,
      color: 1,
      currency: 1,
      hash: 1,
      roman: 1,
      disable: 1,
      enable: 1,
      help: 1,
      prefix: 1,
    };
    for (let i = 0; i < disabled.length; ++i) {
      commands[disabled[i]] = 0;
    }

    if (message.content.startsWith(pref)) {
      const args = message.content.substring(pref.length + 1).split(' ');
      switch (args[0]) {
        case 'avatar':
          if (commands.avatar) {
            discord.avatar(args, message);
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
            fun.ping(args, message);
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
        case 'imdb':
          if (commands.imdb) {
            integrations.imdb(args, message);
          } else {
            message.channel.send('This command is disabled!');
          }
          break;
        case 'imgur':
          if (commands.imgur) {
            integrations.imgur(args, message);
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
        case 'stackex':
          if (commands.stackex) {
            integrations.stackex(args, message);
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
        case 'weather':
          if (commands.weather) {
            integrations.weather(args, message);
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
        case 'calc':
          if (commands.calc) {
            productivity.calc(args, message);
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
          utility.disable(args, message, con, disabledString, commands);
          break;
        case 'enable':
          utility.enable(args, message, con, disabledString, commands);
          break;
        case 'help':
          if (commands.help) {
            utility.help(args, message);
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
          message.channel.send('Invalid Syntax! Try:\n`help` to display a help embed or\n`help` {category} to display the list of commands from a category');
      }
    }
  });
});
