/* eslint-disable sort-keys */
'use strict';
const Discord = require('discord.js');
const request = require('request');
const Snoowrap = require('snoowrap');
const ud = require('urban-dictionary');

require('dotenv').config();

module.exports = {
  dict (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`dict <word>`**\n  - **to display the definition of a word from the Merriam-Webster Dictionary: https://www.merriam-webster.com/**');
    } else {
      args.splice(0, 1);
      const s = args.join('%20');
      message.channel.send(`https://www.merriam-webster.com/dictionary/${s}`);
    }
  },
  imdb (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`imdb <movie title>`**\n  - **to display information about a movie from IMDb: https://www.imdb.com/**');
    } else {
      args.splice(0, 1);
      const s = args.join('%20');
      const url = `http://www.omdbapi.com/?apikey=${process.env.API_KEYS_OMDB}&s=${s}`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        message.channel.send(`https://www.imdb.com/title/${Obj.Search[0].imdbID}`);
      });
    }
  },
  imgur (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`imgur <search term(s)>`**\n  - **to display the most relevant image from imgur: https://imgur.com, sorting by time**\n* **`imgur <sort> <search term(s)>`**\n  - **where `<sort>` must be `time | viral | top`**\n  - **to display the most relevant image from imgur: https://imgur.com, sorting by `<sort>`**\n  - **if `<sort>` is `top`, the time period is `all`**\n* **`imgur top <time> <search term(s)>`**\n  - **where `<time>` must be `day | week | month | year | all`**\n  - **to display the most relevant image from imgur: https://imgur.com, sorting by `top`, in the time period of `<time>`**');
    } else {
      args.splice(0, 1);
      const allSort = '-time|-viral|-top';
      const allRange = '-day|-week|-month|-year|-all';
      let url;
      if (allSort.includes(args[0].toLowerCase())) {
        if (args[0] == '-time' || args[0] == '-viral' || args[0] == '-top' && !allRange.includes(args[1])) {
          const sort = args[0].substring(1);
          args.splice(0, 1);
          const s = args.join(' ');
          url = `https://api.imgur.com/3/gallery/search/${sort}?q=${s}&client_id=${process.env.OAUTH_IMGUR_CLIENT_ID}`;
        } else {
          const sort = args[0].substring(1);
          const range = args[1].substring(1);
          args.splice(0, 2);
          const s = args.join(' ');
          url = `https://api.imgur.com/3/gallery/search/${sort}/${range}?q=${s}&client_id=${process.env.OAUTH_IMGUR_CLIENT_ID}`;
        }
      } else {
        const s = args.join(' ');
        url = `https://api.imgur.com/3/gallery/search/time?q=${s}&client_id=${process.env.OAUTH_IMGUR_CLIENT_ID}`;
      }
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        message.channel.send(Obj.data[0].link);
      });
    }
  },
  maps (args, message) {
    const alg1 = (spliceIndex) => {
      args.splice(0, spliceIndex);
      const s = args.join('+');
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${s}&inputtype=textquery&fields=formatted_address&key=${process.env.API_KEYS_GOOGLECLOUDPLATFORM}`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        // eslint-disable-next-line camelcase
        Obj.candidates[0].formatted_address = Obj.candidates[0].formatted_address.replace(/ /gu, '%20');
        message.channel.send(`https://www.google.com/maps/place/${Obj.candidates[0].formatted_address}`);
      });
    };
    const alg2 = () => {
      args.splice(0, 2);
      const s = encodeURIComponent(args.join(' '));
      const url = `https://www.google.com/maps/search/?api=1&query=${s}`;
      message.channel.send(url);
    };
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`maps <location>`**\n  - **to display the map of a location from Google Maps: https://www.google.com/maps/**\n  - **uses alg1**\n* **`maps <algorithm> <location>`**\n  - **where `<algorithm>` must be `alg1 | alg2`**\n  - **to display the map of a location from Google Maps: https://www.google.com/maps/ using a specific algorithm**\n  - **you can specify which algorithm to use (in case the other one fails)**');
    } else if (args[1] == 'alg1') {
      alg1(2);
    } else if (args[1] == 'alg2') {
      alg2();
    } else {
      alg1(1);
    }
  },
  reddit (args, message) {
    const r = new Snoowrap({
      userAgent: 'XBot',
      clientId: process.env.OAUTH_REDDIT_CLIENT_ID,
      clientSecret: process.env.OAUTH_REDDIT_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REDDIT_REFRESH_TOKEN,
    });
    const allTime = 'hour|day|week|month|year|all';
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`reddit rand r/<subreddit>`**\n  - **to display a random post from a subreddit**\n* **`reddit <sort> r/<subreddit>`**\n  - **where `<sort>` must be `hot | new | top | controversial | rising`**\n  - **to display the most relevant post from a subreddit, sorting by `<sort>`**\n  - **if `<sort>` is `top | controversial`, the time period is `all`**\n* **`reddit <sort> <time> r/<subreddit>`**\n  - **where `<sort>` must be `top | controversial`**\n  - **where `<time>` must be `hour | day | week | month | year | all`**\n  - **to display the most relevant post from a subreddit, sorting by `<sort>`, in the time period of `<time>`**\n* **`reddit sub r/<subreddit>`**\n  - **to display a link to a subreddit**\n* **`reddit search <search term(s)>`**\n  - **to display a link to the search results corresponding to the `<search result>` parameter**');
    } else if (args[1] == 'rand' && args[2].startsWith('r/')) {
      args.splice(0, 2);
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getRandomSubmission()
        .url.then((value) => {
          message.channel.send(value);
        });
    } else if (args[1].toLowerCase() === 'hot') {
      args.splice(0, 2);
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getHot()
        .then((value) => {
          message.channel.send(value[0].url);
        });
    } else if (args[1].toLowerCase() === 'new') {
      args.splice(0, 2);
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getNew()
        .then((value) => {
          message.channel.send(value[0].url);
        });
    } else if (args[1].toLowerCase() === 'top') {
      let time;
      if (allTime.includes(args[2].toLowerCase())) {
        time = args[2];
        args.splice(0, 3);
      } else {
        time = 'all';
        args.splice(0, 2);
      }
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getTop({time})
        .then((value) => {
          message.channel.send(value[0].url);
        });
    } else if (args[1].toLowerCase() === 'controversial') {
      let time;
      if (allTime.includes(args[2].toLowerCase())) {
        time = args[2];
        args.splice(0, 3);
      } else {
        time = 'all';
        args.splice(0, 2);
      }
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getControversial({time})
        .then((value) => {
          message.channel.send(value[0].url);
        });
    } else if (args[1].toLowerCase() === 'rising') {
      args.splice(0, 2);
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getRising()
        .then((value) => {
          message.channel.send(value[0].url);
        });
    } else if (args[1] === 'sub' && args[2].startsWith('r/')) {
      args.splice(0, 2);
      const s = args.join('%20');
      message.channel.send(`https://www.reddit.com/${s}`);
    } else if (args[1] === 'search') {
      args.splice(0, 2);
      const s = args.join('%20');
      message.channel.send(`https://www.reddit.com/search/?q=${s}`);
    } else {
      message.channel.send('Invalid Syntax! Try:\n* **`reddit rand r/<subreddit>`**\n  - **to display a random post from a subreddit**\n* **`reddit <sort> r/<subreddit>`**\n  - **where `<sort>` must be `hot | new | top | controversial | rising`**\n  - **to display the most relevant post from a subreddit, sorting by `<sort>`**\n  - **if `<sort>` is `top | controversial`, the time period is `all`**\n* **`reddit <sort> <time> r/<subreddit>`**\n  - **where `<sort>` must be `top | controversial`**\n  - **where `<time>` must be `hour | day | week | month | year | all`**\n  - **to display the most relevant post from a subreddit, sorting by `<sort>`, in the time period of `<time>`**\n* **`reddit sub r/<subreddit>`**\n  - **to display a link to a subreddit**\n* **`reddit search <search term(s)>`**\n  - **to display a link to the search results corresponding to the `<search result>` parameter**');
    }
  },
  stackex (args, message) {
    if (args.length < 2) {
      message.channel.send('Invalid Syntax! Try:\n* **`stackex <search term(s)>`**\n  - **to display the most relevant question from Stack Overflow: https://stackoverflow.com/ - the default site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <direction> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **where `<direction>` must be `asc` (ascendent) `|` `desc` (descendent)**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>` in the direction `<direction>`**');
    } else {
      let url = 'https://api.stackexchange.com/2.2/sites';
      request.get(
        {
          url,
          headers: {
            'accept-encoding': 'gzip',
          },
          gzip: true,
        },
        (error, response, body) => {
          const stackExchangeSites = JSON.parse(body);
          let site = args[1].toLowerCase();
          const isValid = stackExchangeSites.items.some((elem) => site === elem.api_site_parameter);
          const allSort = 'activity|creation|votes|relevance';
          const allOrder = 'asc|desc';
          if (isValid) {
            if (allSort.includes(args[2])) {
              const sort = args[2];
              args.splice(0, 3);
              if (allOrder.includes(args[0])) {
                if (args.length == 1) {
                  message.channel.send('Invalid Syntax! Try:\n* **`stackex <search term(s)>`**\n  - **to display the most relevant question from Stack Overflow: https://stackoverflow.com/ - the default site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <direction> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **where `<direction>` must be `asc` (ascendent) `|` `desc` (descendent)**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>` in the direction `<direction>`**');
                  return;
                }
                const order = args[0];
                args.splice(0, 1);
                const s = args.join(' ');
                url = `https://api.stackexchange.com/2.2/search?pagesize=1&order=${order}&sort=${sort}&intitle=${s}&site=${site}`;
              } else {
                if (args.length == 0) {
                  message.channel.send('Invalid Syntax! Try:\n* **`stackex <search term(s)>`**\n  - **to display the most relevant question from Stack Overflow: https://stackoverflow.com/ - the default site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <direction> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **where `<direction>` must be `asc` (ascendent) `|` `desc` (descendent)**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>` in the direction `<direction>`**');
                  return;
                }
                const s = args.join(' ');
                url = `https://api.stackexchange.com/2.2/search?pagesize=1&order=desc&sort=${sort}&intitle=${s}&site=${site}`;
              }
            } else {
              args.splice(0, 2);
              const s = args.join(' ');
              url = `https://api.stackexchange.com/2.2/search?pagesize=1&order=desc&sort=relevance&intitle=${s}&site=${site}`;
            }
            request.get(
              {
                url,
                headers: {
                  'accept-encoding': 'gzip',
                },
                gzip: true,
              },
              (error2, response2, body2) => {
                const Obj = JSON.parse(body2);
                message.channel.send(Obj.items[0].link);
              }
            );
          } else if (args.length > 1) {
            site = 'stackoverflow';
            args.splice(0, 1);
            const s = args.join(' ');
            url = `https://api.stackexchange.com/2.2/search?pagesize=1&order=desc&sort=relevance&intitle=${s}&site=${site}`;
            request.get(
              {
                url,
                headers: {
                  'accept-encoding': 'gzip',
                },
                gzip: true,
              },
              (error2, response2, body2) => {
                const Obj = JSON.parse(body2);
                message.channel.send(Obj.items[0].link);
              }
            );
          } else {
            message.channel.send('Invalid Syntax! Try:\n* **`stackex <search term(s)>`**\n  - **to display the most relevant question from Stack Overflow: https://stackoverflow.com/ - the default site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site**\n  - **by default, the sorting is by `relevance`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>`**\n  - **by default, the sorting direction is `desc` (descendent)**\n* **`stackex <site> <sort> <direction> <search term(s)>`**\n  - **where `<site>` must be the concatenated name of any Stack Exchage Site: https://stackexchange.com/sites**\n  - **where `<sort>` must be `activity | creation | votes | relevance`**\n  - **where `<direction>` must be `asc` (ascendent) `|` `desc` (descendent)**\n  - **to display the most relevant question from a Stack Exchange: https://stackexchange.com/ site, sorting by `<sort>` in the direction `<direction>`**');
          }
        }
      );
    }
  },
  translate (args, message) {
    if (args.length < 5 || !args[2] == 'to') {
      message.channel.send('Invalid Syntax! Try:\n* **`translate <language code> to <language code> <text>`**\n  - **where `<language code>` must be the code of a language from the [Supported languages Section](https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/)**\n  - **to translate words and sentences between languages**\n  - **Powered by Yandex.Translate**\n  - **http://translate.yandex.com**');
    } else {
      const from = args[1].toLowerCase();
      const to = args[3].toLowerCase();
      args.splice(0, 4);
      const s = args.join(' ');
      const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.API_KEYS_YANDEXTRANSLATE}&text=${s}&lang=${from}-${to}`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        if (Obj.message === 'Invalid parameter: lang') {
          message.channel.send('Invalid language parameters! Please only use the language codes specified in the *Supported languages* section:\nhttps://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/ ');
        } else if (Obj.message === 'The specified translation direction is not supported') {
          message.channel.send(`${Obj.message}!`);
        } else {
          message.channel.send(`Translated:\n\`${Obj.text[0]}\`\n*Powered by Yandex.Translate*\nhttp://translate.yandex.com`);
        }
      });
    }
  },
  twitch (args, message) {
    if (args.length < 3) {
      message.channel.send('Invalid Syntax! Try:\n* **`twitch channel <name>`**\n  - **to display the most relevant Twitch: (https://www.twitch.tv) channel**\n* **`twitch game <name>`**\n  - **to display the most relevant Twitch: (https://www.twitch.tv) game**\n* **`twitch stream <name>`**\n  - **to display the most relevant Twitch (https://www.twitch.tv) stream**');
    } else {
      switch (args[1]) {
        case 'channel': {
          args.splice(0, 2);
          const s = encodeURIComponent(args.join(' '));
          const url = `https://api.twitch.tv/kraken/search/channels?query=${s}&limit=1&client_id=${process.env.API_KEYS_TWITCH}`;
          request(url, (error, response, body) => {
            const Obj = JSON.parse(body);
            if (Obj.channels === null) {
              message.channel.send('Channel not found!');
              return;
            }
            message.channel.send(Obj.channels[0].url);
          });
          break;
        }
        case 'game': {
          args.splice(0, 2);
          const s = encodeURIComponent(args.join('%20'));
          const url = `https://api.twitch.tv/kraken/search/games?query=${s}&client_id=${process.env.API_KEYS_TWITCH}`;
          request(url, (error, response, body) => {
            const Obj = JSON.parse(body);
            if (Obj.games === null) {
              message.channel.send('Game not found!');
              return;
            }
            const x = encodeURIComponent(Obj.games[0].name);
            message.channel.send(`https://www.twitch.tv/directory/game/${x}`);
          });
          break;
        }
        case 'stream': {
          args.splice(0, 2);
          const s = encodeURIComponent(args.join(' '));
          const url = `https://api.twitch.tv/kraken/search/streams?query=${s}&limit=1&client_id=${process.env.API_KEYS_TWITCH}`;
          request(url, (error, response, body) => {
            const Obj = JSON.parse(body);
            if (Obj.streams === null) {
              message.channel.send('Stream not found!');
              return;
            }
            message.channel.send(`https://www.twitch.tv/${Obj.streams[0].channel.name}`);
          });
          break;
        }
        default:
          message.channel.send('Invalid Syntax! Try:\n* **`twitch channel <name>`**\n  - **to display the most relevant Twitch: (https://www.twitch.tv) channel**\n* **`twitch game <name>`**\n  - **to display the most relevant Twitch: (https://www.twitch.tv) game**\n* **`twitch stream <name>`**\n  - **to display the most relevant Twitch (https://www.twitch.tv) stream**');
      }
    }
  },
  urban (args, message) {
    if (args.length < 2) {
      message.channel.send('Invalid Syntax! Try:\n* **`urban rand`**\n  - **to display a random definition from the Urban Dictionary: https://www.urbandictionary.com/**\n* **`urban def <word>`**\n  - **to display the definition of a word from the Urban Dictionary: https://www.urbandictionary.com/**');
    } else if (args[1] == 'rand' && args.length == 2) {
      ud.random()
        .then((result) => {
          message.channel.send(result.permalink);
        })
        .catch(() => {
          message.channel.send('An error has occurred! Try again!');
        });
    } else if (args[1] == 'def' && args.length > 2) {
      args.splice(0, 1);
      const definition = args.join(' ');
      ud.term(definition)
        .then((result) => {
          const entries = result.entries;
          message.channel.send(entries[0].permalink);
        })
        .catch(() => {
          message.channel.send('An error has occurred! Try again!');
        });
    } else {
      message.channel.send('Invalid Syntax! Try:\n* **`urban rand`**\n  - **to display a random definition from the Urban Dictionary: https://www.urbandictionary.com/**\n* **`urban def <word>`**\n  - **to display the definition of a word from the Urban Dictionary: https://www.urbandictionary.com/**');
    }
  },
  weather (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`weather <location>`**\n  - **to display the detailed weather of a location using Open Weather: https://openweathermap.org/**');
    } else {
      args.splice(0, 1);
      const s = args.join('%20');
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${s}&units=metric&APPID=${process.env.API_KEYS_OPENWEATHER}`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        const sunrise = new Date(parseInt(Obj.sys.sunrise, 10) * 1000 + Obj.timezone / 1000);
        const sunriseHour = sunrise.getHours();
        let sunriseMinute = `${sunrise.getMinutes()}`;
        if (sunriseMinute.length == 1) {
          sunriseMinute = `0${sunriseMinute}`;
        }
        const sunset = new Date(parseInt(Obj.sys.sunset, 10) * 1000 + Obj.timezone / 1000);
        const sunsetHour = sunset.getHours();
        let sunsetMinute = `${sunset.getMinutes()}`;
        if (sunsetMinute.length == 1) {
          sunsetMinute = `0${sunsetMinute}`;
        }
        const currentWeather = new Discord.RichEmbed()
          .setColor('#fcb103')
          .attachFiles(['./assets/images/open_weather_logo.png'])
          .setAuthor('Open Weather', 'attachment://open_weather_logo.png', 'https://openweathermap.org/')
          .setThumbnail(`http://openweathermap.org/img/wn/${Obj.weather[0].icon}@2x.png`)
          .setTitle(`Weather in ${Obj.name}, ${Obj.sys.country}`)
          .setDescription(`${Obj.main.temp}°C`)
          .setURL(`https://openweathermap.org/city/${Obj.id}`)
          .addField(`Weather: ${Obj.weather[0].main}`, Obj.weather[0].description)
          .addField('Wind: ', `Speed = ${Obj.wind.speed} meters/sec, Direction = ${Obj.wind.deg}°`, true)
          .addField('Cloudiness: ', `${Obj.clouds.all}%`, true)
          .addField('Pressure: ', `${Obj.main.pressure} hPa`, true)
          .addField('Humidity: ', `${Obj.main.humidity}%`, true)
          .addField('Sunrise: ', `${sunriseHour}:${sunriseMinute}`, true)
          .addField('Sunset: ', `${sunsetHour}:${sunsetMinute}`, true)
          .addField('Geo Coordinates:', `Lat: ${Obj.coord.lat}, Lon: ${Obj.coord.lon}`, true)
          .setTimestamp()
          .setFooter('Data from: https://openweathermap.org', 'attachment://open_weather_logo.png');
        message.channel.send(currentWeather);
      });
    }
  },
  yt (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n* **`yt <search term(s)>`**\n  - **to display the most relevant result from YouTube (https://www.youtube.com/) (a video, a channel, a topic or a live stream)**');
    } else {
      args.splice(0, 1);
      const s = args.join(' ');
      const url = `https://www.googleapis.com/youtube/v3/search?q=${s}&part=snippet&maxResults=1&order=relevance&regionCode=US&safeSearch=moderate&key=${process.env.API_KEYS_GOOGLECLOUDPLATFORM}`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        if (Object.prototype.hasOwnProperty.call(Obj.items[0].id, 'channelId')) {
          message.channel.send(`https://www.youtube.com/channel/${Obj.items[0].id.channelId}`);
        } else if (Object.prototype.hasOwnProperty.call(Obj.items[0].id, 'videoId')) {
          message.channel.send(`https://www.youtube.com/watch?v=${Obj.items[0].id.videoId}`);
        }
      });
    }
  },
};
