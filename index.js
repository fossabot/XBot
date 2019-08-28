/* eslint-disable sort-keys */
const Discord = require('discord.js');
const {Pool} = require('pg');

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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.on('guildCreate', (guild) => {
  const sql = 'INSERT INTO servers (id, prefix, disabled) VALUES ($1, \'!x\', \'\')';
  const inserts = [guild.id];
  pool.query(sql, inserts).catch((err) => {
    console.error(err);
  });
});

client.on('guildDelete', (guild) => {
  const sql = 'DELETE FROM servers WHERE id = $1';
  const inserts = [guild.id];
  pool.query(sql, inserts).catch((err) => {
    console.error(err);
  });
});

client.on('message', (message) => {
  if (!message.guild) {
    return;
  }
  const sql = 'SELECT prefix, disabled FROM servers WHERE id = $1';
  const inserts = [message.guild.id];
  pool
    .query(sql, inserts)
    .then((result) => {
      const pref = result.rows[0].prefix;
      const disabledString = result.rows[0].disabled;
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
      disabled.forEach((command) => {
        commands[command] = 0;
      });
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
            utility.disable(args, message, pool, disabledString, commands);
            break;
          case 'enable':
            utility.enable(args, message, pool, disabledString, commands);
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
              utility.prefix(args, message, pool);
            } else {
              message.channel.send('This command is disabled!');
            }
            break;
          default:
            message.channel.send('Invalid Syntax! Try:\n* **`help`**\n  - **to display a help message with useful information**\n* **`help <category>`**\n  - **where `<category>` must be a valid bot command category: `discord | fun | integrations | productivity | utility`**\n  - **to display the list of commands from a category**');
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
