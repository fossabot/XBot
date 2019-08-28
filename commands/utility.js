const Discord = require('discord.js');

module.exports = {
  disable (args, message, pool, disabledString, commands) {
    if (args.length != 2) {
      message.channel.send('Invalid Syntax! Try:\n* **`disable <command>`**\n  - **where `<command>` must be a valid bot command**\n  - **to disable a command**');
      return;
    }
    args[1] = args[1].toLowerCase();
    if (args[1] == 'enable' || args[1] == 'disable') {
      message.channel.send('`enable` and `disable` can\'t be disabled!');
    } else if (!Object.prototype.hasOwnProperty.call(commands, args[1])) {
      message.channel.send('Please enter a valid command!');
    } else if (message.member.hasPermission('MANAGE_GUILD')) {
      if (disabledString.includes(args[1])) {
        message.channel.send('This command is already disabled!');
      } else {
        const sql = 'UPDATE servers SET disabled = $1 WHERE id = $2';
        const inserts = [disabledString + args[1], message.guild.id];
        pool.query(sql, inserts).catch((err) => {
          console.error(err);
        });
        message.channel.send(`Succesfully disabled:\n\`${args[1]}\``);
      }
    } else {
      message.channel.send('You don\'t have the necessary permissions!');
    }
  },
  enable (args, message, pool, disabledString, commands) {
    if (args.length != 2) {
      message.channel.send('Invalid Syntax! Try:\n* **`enable <command>`**\n  - **where `<command>` must be a valid bot command**\n  - **to enable a command**');
      return;
    }
    args[1] = args[1].toLowerCase();
    if (args[1] == 'enable' || args[1] == 'disable') {
      message.channel.send('`enable` and `disable` can\'t be enabled!');
    } else if (!Object.prototype.hasOwnProperty.call(commands, args[1])) {
      message.channel.send('Please enter a valid command!');
    } else if (message.member.hasPermission('MANAGE_GUILD')) {
      if (disabledString.includes(args[1])) {
        let disabledStr = disabledString;
        disabledStr = disabledStr.replace(args[1], '');
        disabledStr = disabledStr.replace(/\s+/gu, ' ');
        const sql = 'UPDATE servers SET disabled = $1 WHERE id = $2';
        const inserts = [disabledStr, message.guild.id];
        pool.query(sql, inserts).catch((err) => {
          console.error(err);
        });
        message.channel.send(`Succesfully enabled:\n\`${args[1]}\``);
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
      switch (args[1].toLowerCase()) {
        case 'discord': {
          const discordCommands = new Discord.RichEmbed()
            .setColor('#3256a8')
            .attachFiles(['./assets/images/icon.png'])
            .setAuthor('XBot', 'attachment://icon.png', 'https://github.com/paul-soporan/XBot')
            .setThumbnail('attachment://icon.png')
            .setTitle('Command Category: **Discord**')
            .setURL('https://github.com/paul-soporan/XBot/wiki/Discord')
            .setDescription('List of Discord Commands:')
            .addField(
              'avatar',
              '\n* **`avatar <user mention>`**\n  - **to display a user\'s avatar**\n* **`avatar`**\n  - **to display your own avatar**'
            )
            .addField('***ban***', '\n* **`ban <member mention>`**\n  - **to ban a member**')
            .addField('***kick***', '\n* **`kick <member mention>`**\n  - **to kick a member**')
            .addField('***nick***', '\n* **`nick <member mention> <new nickname>`**\n  - **to nickname a member**')
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
            .setTitle('Command Category: **Fun**')
            .setDescription('List of Fun Commands:')
            .setURL('https://github.com/paul-soporan/XBot/wiki/Fun')
            .addField('***ping***', '\n* **`ping`**\n  - **to get a "pong" reply**')
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
            .setTitle('Command Category: **Integrations**')
            .setDescription('List of Integrations Commands:')
            .setURL('https://github.com/paul-soporan/XBot/wiki/Integrations')
            .addField(
              '***dict***',
              '\n* **`dict <word>`**\n  - **to display the definition of a word from the Merriam-Webster Dictionary: https://www.merriam-webster.com/**'
            )
            .addField(
              '***imdb***',
              '\n* **`imdb <movie title>`**\n  - **to display information about a movie from IMDb: https://www.imdb.com/**'
            )
            .addField(
              '***imgur***',
              '\n* **`imgur <search term(s)>`**\n  - **to display the most relevant image from imgur: https://imgur.com, sorting by time**\n* **`imgur <sort> <search term(s)>`**\n  - **where `<sort>` must be `time | viral | top`**\n  - **to display the most relevant image from imgur: https://imgur.com, sorting by `<sort>`**\n  - **if `<sort>` is `top`, the time period is `all`**\n* **`imgur top <time> <search term(s)>`**\n  - **where `<time>` must be `day | week | month | year | all`**\n  - **to display the most relevant image from imgur: https://imgur.com, sorting by `top`, in the time period of `<time>`**'
            )
            .addField(
              '***maps***',
              '\n* **`maps <location>`**\n  - **to display the map of a location from Google Maps: https://www.google.com/maps/**\n  - **uses alg1**\n* **`maps <algorithm> <location>`**\n  - **where `<algorithm>` must be `alg1 | alg2`**\n  - **to display the map of a location from Google Maps: https://www.google.com/maps/ using a specific algorithm**\n  - **you can specify which algorithm to use (in case the other one fails)**'
            )
            .addField(
              '***reddit***',
              '\n* **`reddit rand r/<subreddit>`**\n  - **to display a random post from a subreddit**\n* **`reddit <sort> r/<subreddit>`**\n  - **where `<sort>` must be `hot | new | top | controversial | rising`**\n  - **to display the most relevant post from a subreddit, sorting by `<sort>`**\n  - **if `<sort>` is `top | controversial`, the time period is `all`**\n* **`reddit <sort> <time> r/<subreddit>`**\n  - **where `<sort>` must be `top | controversial`**\n  - **where `<time>` must be `hour | day | week | month | year | all`**\n  - **to display the most relevant post from a subreddit, sorting by `<sort>`, in the time period of `<time>`**\n* **`reddit sub r/<subreddit>`**\n  - **to display a link to a subreddit**\n* **`reddit search <search term(s)>`**\n  - **to display a link to the search results corresponding to the `<search result>` parameter**'
            )
            .addField(
              '***stackex***',
              '\n***The last two usages of this command didn\'t fit in this embed. You can see them at: https://github.com/paul-soporan/XBot/wiki/Integrations#stackex***\n* **`stackex <search term(s)>`**\n  - **to display the most relevant question from Stack Overflow: https://stackoverflow.com/ - the default site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**'
            )
            .addField(
              '***translate***',
              '\n* **`translate <language code> to <language code> <text>`**\n  - **where `<language code>` must be the code of a language from the [Supported languages Section](https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/)**\n  - **to translate words and sentences between languages**\n  - **Powered by Yandex.Translate**\n  - **http://translate.yandex.com**'
            )
            .addField(
              '***twitch***',
              '\n* **`twitch channel <name>`**\n  - **to display the most relevant Twitch: (https://www.twitch.tv) channel**\n* **`twitch game <name>`**\n  - **to display the most relevant Twitch: (https://www.twitch.tv) game**\n* **`twitch stream <name>`**\n  - **to display the most relevant Twitch (https://www.twitch.tv) stream**'
            )
            .addField(
              '***urban***',
              '\n* **`urban rand`**\n  - **to display a random definition from the Urban Dictionary: https://www.urbandictionary.com/**\n* **`urban def <word>`**\n  - **to display the definition of a word from the Urban Dictionary: https://www.urbandictionary.com/**'
            )
            .addField(
              '***weather***',
              '\n* **`weather <location>`**\n  - **to display the detailed weather of a location using Open Weather: https://openweathermap.org/**'
            )
            .addField(
              '***yt***',
              '\n* **`yt <search term(s)>`**\n  - **to display the most relevant result from YouTube (https://www.youtube.com/) (a video, a channel, a topic or a live stream)**'
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
            .setTitle('Command Category: **Productivity**')
            .setDescription('List of Productivity Commands: ')
            .setURL('https://github.com/paul-soporan/XBot/wiki/Productivity')
            .addField(
              '***base***',
              '\n* **`base <value> <base> to <base>`**\n  - **where `<value>` must be a positive integer, NOT a floating point number**\n  - **where `<base>` must be a number between 2 and 36 (inclusive) or `BIN | OCT | DEC | HEX`**\n  - **to convert between bases**'
            )
            .addField(
              '***calc***',
              '\n* **`calc <mathematical expression>`**\n  - **where `<mathematical expression>` must be a valid mathematical expression, according to https://mathjs.org/docs/expressions/syntax.html**\n  - **to evaluate a mathematical expression using MathJS: https://mathjs.org/**'
            )
            .addField(
              '***color***',
              '\n* **`color <HEX value | RGB value>`**\n  - **where `<HEX value>` must be a valid HEX color, examples: #000000 or #FFFFFF**\n  - **where `<RGB value>` must be a valid RGB color, examples: rgb(0,0,0) or rgb(255,255,255)**\n  - **to convert a color value between HEX and RGB (the type is auto-detected)**'
            )
            .addField(
              '***currency***',
              '\n* **`currency <value> <code> to <code>`**\n  - **where `<code>` must be a valid code from https://fixer.io/symbols**\n  - **to convert between currencies using Fixer.io: https://fixer.io/**'
            )
            .addField(
              '***hash***',
              '\n* **`hash <sequence>`**\n  - **to hash a sequence of characters using md5, sha1 and sha256**'
            )
            .addField(
              '***roman***',
              '\n* **`roman <roman numeral | decimal number>`**\n  - **where `<roman numeral>` must be a valid roman numeral**\n  - **where `<decimal number>` must be a positive integer, NOT a floating point number**\n  - **to convert a number (the type is auto-detected)**'
            )
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
            .setTitle('Command Category: **Utility**')
            .setDescription('List of Utility Commands: ')
            .setURL('https://github.com/paul-soporan/XBot/wiki/Utility')
            .addField(
              '***disable***',
              '\n* **`disable <command>`**\n  - **where `<command>` must be a valid bot command**\n  - **to disable a command**'
            )
            .addField(
              '***enable***',
              '\n* **`enable <command>`**\n  - **where `<command>` must be a valid bot command**\n  - **to enable a command**'
            )
            .addField(
              '***help***',
              '\n* **`help`**\n  - **to display a help message with useful information**\n* **`help <category>`**\n  - **where `<category>` must be a valid bot command category: `discord | fun | integrations | productivity | utility`**\n  - **to display the list of commands from a category**'
            )
            .addField('***prefix***', '\n* **`prefix <new prefix>`**\n  - **to change the prefix**')
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
        .setTitle('Welcome to the XBot help page!')
        .setURL('https://github.com/paul-soporan/XBot/blob/master/README.md')
        .setDescription('You are running version 1.0.0: https://github.com/paul-soporan/XBot/releases/tag/1.0.0')
        .addField(
          '***Help***',
          '* **`help <category>`**\n  - **where `<category>` must be a valid bot command category**\n  - **to display the list of commands from a category**'
        )
        .addField('***Categories:***', '* *Discord*\n* *Fun*\n* *Integrations*\n* *Productivity*\n* *Utility*')
        .addField(
          '**Documentation about this bot can be found on the GitHub Wiki:**',
          'https://github.com/paul-soporan/XBot/wiki'
        )
        .addField(
          '**If you have an issue or a suggestion, please create an issue on GitHub:**',
          'https://github.com/paul-soporan/XBot/issues'
        )
        .addField('**For more information, visit the project page on Github:**', 'https://github.com/paul-soporan/XBot')
        .setTimestamp()
        .setFooter('https://github.com/paul-soporan/XBot', 'attachment://icon.png');
      message.channel.send(help);
    } else {
      message.channel.send('Invalid Syntax! Try:\n* **`help`**\n  - **to display a help message with useful information**\n* **`help <category>`**\n  - **where `<category>` must be a valid bot command category: `discord | fun | integrations | productivity | utility`**\n  - **to display the list of commands from a category**');
    }
  },
  prefix (args, message, pool) {
    if (args.length < 2) {
      message.channel.send('Invalid Syntax! The new prefix is missing. Try:\n* **`prefix <new prefix>`**\n  - **to change the prefix**');
    } else if (message.member.hasPermission('MANAGE_GUILD')) {
      args.splice(0, 1);
      const s = args.join(' ');
      const sql = 'UPDATE servers SET prefix = $1 WHERE id = $2';
      const inserts = [s, message.guild.id];
      pool.query(sql, inserts).catch((err) => {
        console.error(err);
      });
      message.channel.send(`Changed prefix to:\n\`${s}\``);
    } else {
      message.channel.send('You don\'t have the necessary permissions!');
    }
  },
};
