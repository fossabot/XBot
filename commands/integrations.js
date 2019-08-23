/* eslint-disable sort-keys */
'use strict';
const Discord = require('discord.js');
const request = require('request');
const Snoowrap = require('snoowrap');
const ud = require('urban-dictionary');

const credentials = require('../credentials.json');

module.exports = {
  dict (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n`dict {word(s)}` to get the definition of a word(/of some words)');
    } else {
      args.splice(0, 1);
      const s = args.join('%20');
      message.channel.send(`https://www.merriam-webster.com/dictionary/${s}`);
    }
  },
  imdb (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n`imdb {movie title}` to search for a movie on IMDb');
    } else {
      args.splice(0, 1);
      const s = args.join('%20');
      const url = `http://www.omdbapi.com/?apikey=${credentials.apiKeys.omdb}&s=${s}`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        message.channel.send(`https://www.imdb.com/title/${Obj.Search[0].imdbID}`);
      });
    }
  },
  imgur (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n`imgur {[OPTIONAL] time (default)| viral | top} {[OPTIONAL] (if top) -> day | week | month | year | all (default)} {search term(s)}` to search images on imgur');
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
          url = `https://api.imgur.com/3/gallery/search/${sort}?q=${s}&client_id=${credentials.oauth.imgur.clientId}`;
        } else {
          const sort = args[0].substring(1);
          const range = args[1].substring(1);
          args.splice(0, 2);
          const s = args.join(' ');
          url = `https://api.imgur.com/3/gallery/search/${sort}/${range}?q=${s}&client_id=${credentials.oauth.imgur.clientId}`;
        }
      } else {
        const s = args.join(' ');
        url = `https://api.imgur.com/3/gallery/search/time?q=${s}&client_id=${credentials.oauth.imgur.clientId}`;
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
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${s}&inputtype=textquery&fields=formatted_address&key=${credentials.apiKeys.googleCloud}`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        // eslint-disable-next-line camelcase
        Obj.candidates[0].formatted_address = Obj.candidates[0].formatted_address.replace(/ /gu, '%20');
        message.channel.send(`https://www.google.com/maps/place/${Obj.candidates[0].formatted_address}`);
      });
    };
    const alg2 = () => {
      args.splice(0, 2);
      const s = args
        .join('+')
        .replace(/,/gu, '%2C')
        .replace(/\|/gu, '%7C')
        .replace(/"/gu, '%22')
        .replace(/</gu, '%3C')
        .replace(/>/gu, '%3E')
        .replace(/#/gu, '%23')
        .replace(/%/gu, '%25');
      const url = `https://www.google.com/maps/search/?api=1&query=${s}`;
      message.channel.send(url);
    };
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n`maps {[OPTIONAL] alg1 (default) | alg2} {location}` to display the map of a location\n**You can specify which algorithm to use (in case the other one fails');
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
      clientId: credentials.oauth.reddit.clientId,
      clientSecret: credentials.oauth.reddit.clientSecret,
      refreshToken: credentials.oauth.reddit.refreshToken,
    });
    const allTime = '-hour|-day|-week|-month|-year|-all';
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n`reddit -rand {r/subredditName} to display a random submission from a subreddit`\n`reddit {-hot | -new | -rising} {r/subredditName} to display the newest, hottest or most rising submission from a subreddit`\n`reddit {-top | -controversial} {[OPTIONAL] -hour | -day | -week | -month | -year | -all (default)} {r/subredditName} to display the top or the most controversial post from a period of time`\n`reddit sub {r/subredditName}` to display a subreddit\n`reddit search {search term}` to search something on reddit');
    } else if (args[1] == '-rand' && args[2].startsWith('r/')) {
      args.splice(0, 2);
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getRandomSubmission()
        .url.then((value) => {
          message.channel.send(value);
        });
    } else if (args[1].toLowerCase() === '-hot') {
      args.splice(0, 2);
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getHot()
        .then((value) => {
          message.channel.send(value[0].url);
        });
    } else if (args[1].toLowerCase() === '-new') {
      args.splice(0, 2);
      const s = args.join('%20');
      r.getSubreddit(s.substring(2))
        .getNew()
        .then((value) => {
          message.channel.send(value[0].url);
        });
    } else if (args[1].toLowerCase() === '-top') {
      let time;
      if (allTime.includes(args[2].toLowerCase())) {
        time = args[2].substring(1);
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
    } else if (args[1].toLowerCase() === '-controversial') {
      let time;
      if (allTime.includes(args[2].toLowerCase())) {
        time = args[2].substring(1);
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
    } else if (args[1].toLowerCase() === '-rising') {
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
      message.channel.send('Invalid Syntax! Try:\n`reddit -rand {r/subredditName} to display a random submission from a subreddit`\n`reddit {-hot | -new | -rising} {r/subredditName} to display the newest, hottest or most rising submission from a subreddit`\n`reddit {-top | -controversial} {[OPTIONAL] -hour | -day | -week | -month | -year | -all (default)} {r/subredditName} to display the top or the most controversial post from a period of time`\n`reddit sub {r/subredditName}` to display a subreddit\n`reddit search {search term}` to search something on reddit');
    }
  },
  stackov (args, message) {
    args.splice(0, 1);
    const s = args.join(' ');
    const url = `https://api.stackexchange.com/2.2/search?pagesize=1&order=desc&sort=relevance&intitle=${s}&site=stackoverflow`;
    request.get(
      {
        url,
        headers: {
          'accept-encoding': 'gzip',
        },
        gzip: true,
      },
      (error, response, body) => {
        const Obj = JSON.parse(body);
        message.channel.send(Obj.items[0].link);
      }
    );
  },
  translate (args, message) {
    if (args.length < 5 || !args[2] == 'to') {
      message.channel.send('Invalid Syntax! Try:\n`translate {langFrom} to {langTo} {word/sentence}` to translate words and sentences between languages');
    } else {
      const from = args[1].toLowerCase();
      const to = args[3].toLowerCase();
      args.splice(0, 4);
      const s = args.join(' ');
      const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${credentials.apiKeys.yandexTranslate}&text=${s}&lang=${from}-${to}`;
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
    switch (args[1]) {
      case 'channel': {
        args.splice(0, 2);
        let s = args.join('%20');
        s = s.replace(/,/gu, '%2C');
        s = s.replace(/\|/gu, '%7C');
        s = s.replace(/"/gu, '%22');
        s = s.replace(/</gu, '%3C');
        s = s.replace(/>/gu, '%3E');
        s = s.replace(/#/gu, '%23');
        s = s.replace(/%/gu, '%25');
        const url = `https://api.twitch.tv/kraken/search/channels?query=${s}&limit=1&client_id=${credentials.apiKeys.twitch}`;
        request(url, (error, response, body) => {
          const Obj = JSON.parse(body);
          message.channel.send(Obj.channels[0].url);
        });
        break;
      }
      case 'game': {
        args.splice(0, 2);
        let s = args.join('%20');
        s = s.replace(/,/gu, '%2C');
        s = s.replace(/\|/gu, '%7C');
        s = s.replace(/"/gu, '%22');
        s = s.replace(/</gu, '%3C');
        s = s.replace(/>/gu, '%3E');
        s = s.replace(/#/gu, '%23');
        s = s.replace(/%/gu, '%25');
        const url = `https://api.twitch.tv/kraken/search/games?query=${s}&client_id=${credentials.apiKeys.twitch}`;
        request(url, (error, response, body) => {
          const Obj = JSON.parse(body);
          let x = Obj.games[0].name;
          x = x.replace(/ /gu, '%20');
          x = x.replace(/,/gu, '%2C');
          x = x.replace(/\|/gu, '%7C');
          x = x.replace(/"/gu, '%22');
          x = x.replace(/</gu, '%3C');
          x = x.replace(/>/gu, '%3E');
          x = x.replace(/#/gu, '%23');
          x = x.replace(/%/gu, '%25');
          message.channel.send(`https://www.twitch.tv/directory/game/${x}`);
        });
        break;
      }
      case 'stream': {
        args.splice(0, 2);
        let s = args.join('%20');
        s = s.replace(/,/gu, '%2C');
        s = s.replace(/\|/gu, '%7C');
        s = s.replace(/"/gu, '%22');
        s = s.replace(/</gu, '%3C');
        s = s.replace(/>/gu, '%3E');
        s = s.replace(/#/gu, '%23');
        s = s.replace(/%/gu, '%25');
        const url = `https://api.twitch.tv/kraken/search/streams?query=${s}&limit=1&client_id=${credentials.apiKeys.twitch}`;
        request(url, (error, response, body) => {
          const Obj = JSON.parse(body);
          message.channel.send(`https://www.twitch.tv/${Obj.streams[0].channel.name}`);
        });
        break;
      }
      default:
        message.channel.send('Invalid Syntax!');
    }
  },
  urban (args, message) {
    if (args.length < 2) {
      message.channel.send('Invalid Syntax! Try:\n`urban rand` to display a random definition\n`urban def {word/sequence}` to display the definition of a specific word or sequence');
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
      message.channel.send('Invalid Syntax! Try:\n`urban rand` to display a random definition\n`urban def {word/sequence}` to display the definition of a specific word or sequence');
    }
  },
  weather (args, message) {
    if (args.length == 1) {
      message.channel.send('Invalid Syntax! Try:\n`weather {location}` to desplay a detailed embed of location\'s weather');
    } else {
      args.splice(0, 1);
      const s = args.join('%20');
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${s}&units=metric&APPID=${credentials.apiKeys.openWeather}`;
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
          .addField(`Weather:${Obj.weather[0].main}`, Obj.weather[0].description)
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
    args.splice(0, 1);
    const s = args.join(' ');
    const url = `https://www.googleapis.com/youtube/v3/search?q=${s}&part=snippet&maxResults=1&order=relevance&regionCode=US&safeSearch=moderate&key=${credentials.apiKeys.googleCloud}`;
    request(url, (error, response, body) => {
      const Obj = JSON.parse(body);
      if (Object.prototype.hasOwnProperty.call(Obj.items[0].id, 'channelId')) {
        message.channel.send(`https://www.youtube.com/channel/${Obj.items[0].id.channelId}`);
      } else if (Object.prototype.hasOwnProperty.call(Obj.items[0].id, 'videoId')) {
        message.channel.send(`https://www.youtube.com/watch?v=${Obj.items[0].id.videoId}`);
      }
    });
  },
};
