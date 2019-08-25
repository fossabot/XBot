const Discord = require('discord.js');
const mysql = require('mysql');

module.exports = {
  disable (args, message, con, disabledString, commands) {
    args[1] = args[1].toLowerCase();
    if (args.length != 2) {
      message.channel.send('Invalid Syntax! Try:\n`disable {command}` to disable a command');
    } else if (args[1] == 'enable' || args[1] == 'disable') {
      message.channel.send('`enable` and `disable` can\'t be disabled!');
    } else if (!Object.prototype.hasOwnProperty.call(commands, args[1])) {
      message.channel.send('Please enter a valid command!');
    } else if (message.member.hasPermission('MANAGE_GUILD')) {
      if (disabledString.includes(args[1])) {
        message.channel.send('This command is already disabled!');
      } else {
        let sql = 'UPDATE ?? SET disabled = ? WHERE id = ?';
        const inserts = ['servers', disabledString + args[1], message.guild.id];
        sql = mysql.format(sql, inserts);
        con.query(sql, (err) => {
          if (err) {
            throw err;
          }
          message.channel.send(`Succesfully disabled:\n\`${args[1]}\``);
        });
      }
    } else {
      message.channel.send('You don\'t have the necessary permissions!');
    }
  },
  enable (args, message, con, disabledString, commands) {
    args[1] = args[1].toLowerCase();
    if (args.length != 2) {
      message.channel.send('Invalid Syntax! Try:\n`enable {command}` to enable a command');
    } else if (args[1] == 'enable' || args[1] == 'disable') {
      message.channel.send('`enable` and `disable` can\'t be enabled!');
    } else if (!Object.prototype.hasOwnProperty.call(commands, args[1])) {
      message.channel.send('Please enter a valid command!');
    } else if (message.member.hasPermission('MANAGE_GUILD')) {
      if (disabledString.includes(args[1])) {
        let disabledStr = disabledString;
        disabledStr = disabledStr.replace(args[1], '');
        disabledStr = disabledStr.replace(/\s+/gu, ' ');
        let sql = 'UPDATE ?? SET disabled = ? WHERE id =  ?';
        const inserts = ['servers', disabledStr, message.guild.id];
        sql = mysql.format(sql, inserts);
        con.query(sql, (err) => {
          if (err) {
            throw err;
          }
          message.channel.send(`Succesfully enabled:\n\`${args[1]}\``);
        });
      } else {
        message.channel.send('This command is not disabled!');
      }
    } else {
      message.channel.send('You don\'t have the necessary permissions!');
    }
  },
  help (args, message) {
    const categories = 'discord|fun|integrations|productivity|utility';
    if (categories.includes(args[1])) {
      // eslint-disable-next-line default-case
      switch (args[1]) {
        case 'discord': {
          const discordCommands = new Discord.RichEmbed()
            .setColor('#3256a8')
            .attachFiles(['./assets/images/icon.png'])
            .setAuthor('XBot', 'attachment://icon.png', 'https://github.com/paul-soporan/XBot')
            .setThumbnail('attachment://icon.png')
            .setTitle('Discord Commands')
            .setURL('https://github.com/paul-soporan/XBot/blob/master/README.md')
            .setDescription('List of Discord Commands:')
            .addField('avatar', '`avatar {user mention}` to display a user\'s avatar or\n`avatar` to display your own avatar')
            .addField('ban', '`ban {member mention}` to ban a member')
            .addField('kick', '`kick {member mention}` to kick a member')
            .addField('nick', '`nick {member mention} {new nickname}` to nickname a member')
            .setTimestamp()
            .setFooter('https://github.com/paul-soporan/XBot', 'attachment://icon.png');
          message.channel.send(discordCommands);
          break;
        }
        case 'fun': {
          const funCommands = new Discord.RichEmbed()
            .setColor('#3256a8')
            .attachFiles(['./assets/images/icon.png'])
            .setAuthor('XBot', 'attachment://icon', 'https://github.com/paul-soporan/XBot')
            .setThumbnail('attachment://icon.png')
            .setTitle('Fun Commands')
            .setDescription('List of Fun Commands: ')
            .setURL('https://github.com/paul-soporan/XBot/blob/master/README.md')
            .addField('ping', '`ping` to get a "pong" reply')
            .setTimestamp()
            .setFooter('https://github.com/paul-soporan/XBot', 'attachment://icon.png');
          message.channel.send(funCommands);
          break;
        }
        case 'integrations': {
          const integrationsCommands = new Discord.RichEmbed()
            .setColor('#3256a8')
            .attachFiles(['./assets/images/icon.png'])
            .setAuthor('XBot', 'attachment://icon', 'https://github.com/paul-soporan/XBot')
            .setThumbnail('attachment://icon.png')
            .setTitle('Integrations Commands')
            .setDescription('List of Integrations Commands: ')
            .setURL('https://github.com/paul-soporan/XBot/blob/master/README.md')
            .addField('dict', '`dict {word(s)}` to get the definition of a word(s)')
            .addField('imdb', '`imdb {movie title}` to search for a movie on IMDb')
            .addField(
              'imgur',
              'imgur: `imgur {[OPTIONAL] time (default)| viral | top} {[OPTIONAL] (if top) -> day | week | month | year | all (default)} {search term(s)}` to search images on imgur'
            )
            .addField(
              'maps',
              '`maps {[OPTIONAL] alg1 (default) | alg2} {location}` to display the map of a location\n**You can specify which algorithm to use (in case the other one fails)**'
            )
            .addField(
              'reddit',
              '`reddit -rand {r/subredditName}`\n`reddit {-hot | -new | -rising} {r/subredditName}`\n`reddit {-top | -controversial} {[OPTIONAL] -hour | -day | -week | -month | -year | -all (default)} {r/subredditName}`\n`reddit sub {r/subredditName}`\n`reddit search {search term}`'
            )
            .addField(
              'stackex',
              '`stackex {[OPTIONAL] site (default:stackoverflow)} {[OPTIONAL] -activity | -creation | -votes | -relevance (default)} {[OPTIONAL -asc | -desc (default)]} {search term}` to search a question on one of the Stack Exchange sites'
            )
            .addField(
              'translate',
              '`translate {langFrom} to {langTo} {word/sentences}` to translate words and sentences between languages'
            )
            .addField(
              'twitch',
              '`twitch {channel | game | stream} {channelName | gameName | streamName}` to search for a channel, game or stream on twitch'
            )
            .addField(
              'urban',
              '`urban rand` to display a random definition\n`urban def {word/sequence}` to display the definition of a specific word or sequence'
            )
            .addField('weather', '`weather {location}` to display a detailed embed of location\'s weather')
            .addField(
              'yt',
              '`yt {search term}` to display the most relevant search result (can be a video, a channel, a topic or a live stream)'
            )
            .setTimestamp()
            .setFooter('https://github.com/paul-soporan/XBot', 'attachment://icon.png');
          message.channel.send(integrationsCommands);
          break;
        }
        case 'productivity': {
          const productivityCommands = new Discord.RichEmbed()
            .setColor('#3256a8')
            .attachFiles(['./assets/images/icon.png'])
            .setAuthor('XBot', 'attachment://icon', 'https://github.com/paul-soporan/XBot')
            .setThumbnail('attachment://icon.png')
            .setTitle('Productivity Commands')
            .setDescription('List of Productivity Commands: ')
            .setURL('https://github.com/paul-soporan/XBot/blob/master/README.md')
            .addField(
              'base',
              '`base {value} {baseFrom} to {baseTo}` to convert between bases\n**baseTo and baseFrom can be numbers between 2 and 36 or one of these strings: "BIN", "OCT", "DEC", "HEX"**'
            )
            .addField(
              'calc',
              '`calc {math expression}` to evaluate a mathematical expression\n**A valid expression must use this expression syntax:*\n https://mathjs.org/docs/expressions/syntax.html'
            )
            .addField(
              'color',
              '`color {HEX value | RGB value}` to convert a color value between HEX and RGB (the type is auto-detected)'
            )
            .addField(
              'currency',
              '`currency {value} {codeFrom} to {codeTo}` to convert between currencies\n**List of supported currencies:**\nhttps://fixer.io/symbols'
            )
            .addField(
              'hash',
              '`hash {sequence}` to hash a sequence of characters(can contain spaces) using md5, sha1 and sha256'
            )
            .addField('roman', '`roman {roman numeral | decimal number}` to convert a number (the type is auto-detected)')
            .setTimestamp()
            .setFooter('https://github.com/paul-soporan/XBot', 'attachment://icon.png');
          message.channel.send(productivityCommands);
          break;
        }
        case 'utility': {
          const utilityCommands = new Discord.RichEmbed()
            .setColor('#3256a8')
            .attachFiles(['./assets/images/icon.png'])
            .setAuthor('XBot', 'attachment://icon', 'https://github.com/paul-soporan/XBot')
            .setThumbnail('attachment://icon.png')
            .setTitle('Utility Commands')
            .setDescription('List of Utility Commands: ')
            .setURL('https://github.com/paul-soporan/XBot/blob/master/README.md')
            .addField('disable', '`disable {command}` to disable a command')
            .addField('enable', '`enable {command}` to enable a command')
            .addField(
              'help',
              '`help` to display a help embed or\n`help` {category} to display the list of commands from a category'
            )
            .addField('prefix', '`prefix {new prefix}` to change the prefix')
            .setTimestamp()
            .setFooter('https://github.com/paul-soporan/XBot', 'attachment://icon.png');
          message.channel.send(utilityCommands);
          break;
        }
      }
    } else if (args.length == 1) {
      const help = new Discord.RichEmbed()
        .setColor('#3256a8')
        .attachFiles(['./assets/images/icon.png'])
        .setAuthor('XBot', 'attachment://icon', 'https://github.com/paul-soporan/XBot')
        .setThumbnail('attachment://icon.png')
        .setTitle('Help')
        .setDescription('`help` {category} to display the list of commands from a category')
        .setURL('https://github.com/paul-soporan/XBot/blob/master/README.md')
        .setTimestamp()
        .setFooter('https://github.com/paul-soporan/XBot', 'attachment://icon.png');
      message.channel.send(help);
    } else {
      message.channel.send('Invalid Syntax! Try:\n`help` to display a help embed or\n`help` {category} to display the list of commands from a category');
    }
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
        if (err) {
          throw err;
        }
      });
      message.channel.send(`Changed prefix to:\n\`${s}\``);
    } else {
      message.channel.send('You don\'t have the necessary permissions!');
    }
  },
};
