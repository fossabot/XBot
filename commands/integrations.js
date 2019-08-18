'use strict';
const Discord = require('discord.js');
const request = require('request');
const snoowrap = require('snoowrap');

const credentials = require('../credentials.json');

module.exports = {
    dict: function (args, message) {
        args.splice(0, 1);
        var s = args.join('%20');
        message.channel.send('https://www.merriam-webster.com/dictionary/' + s);
    },
    imdb: function (args, message) {
        args.splice(0, 1);
        var s = args.join('%20');
        const url = 'http://www.omdbapi.com/?apikey=' + credentials.api_keys.omdb + '&s=' + s;
        request(url, function (error, response, body) {
            var Obj = JSON.parse(body);
            message.channel.send('https://www.imdb.com/title/' + Obj.Search[0].imdbID);
        });
    },
    imgur: function (args, message) {
        args.splice(0, 1);
        var s = args.join(' ');
        const url = 'https://api.imgur.com/3/gallery/search/relevance?q=' + s + '&client_id=' + credentials.oauth.imgur.client_id;
        request(url, function (error, response, body) {
            var Obj = JSON.parse(body);
            message.channel.send(Obj.data[0].link);
        });
    },
    maps: function (args, message) {
        args.splice(0, 1);
        var s = args.join('+');
        s = s.replace(/,/g, '%2C');
        s = s.replace(/\|/g, '%7C');
        s = s.replace(/"/g, '%22');
        s = s.replace(/</g, '%3C');
        s = s.replace(/>/g, '%3E');
        s = s.replace(/#/g, '%23');
        s = s.replace(/%/g, '%25');
        const url = 'https://www.google.com/maps/search/?api=1&query=' + s;
        message.channel.send(url);
    },
    reddit: function (args, message) {
        const r = new snoowrap({
            userAgent: 'XBot',
            clientId: credentials.oauth.reddit.client_id,
            clientSecret: credentials.oauth.reddit.client_secret,
            refreshToken: credentials.oauth.reddit.refresh_token
        });
        args.splice(0, 1);
        var s = args.join('%20');
        if (s.startsWith('r/')) {
            if (s.endsWith('%20-s')) {
                r.getSubreddit(s.substring(2, s.length - 5)).getRandomSubmission().url.then(function (value) {
                    message.channel.send(value);
                });
            } else {
                message.channel.send('https://www.reddit.com/' + s);
            }
        } else {
            message.channel.send('https://www.reddit.com/search/?q=' + s);
        }
    },
    stackov: function (args, message) {
        args.splice(0, 1);
        var s = args.join(' ');
        const url = 'https://api.stackexchange.com/2.2/search?pagesize=1&order=desc&sort=relevance&intitle=' + s + '&site=stackoverflow';
        request.get({
            url: url,
            headers: {
                'accept-encoding': 'gzip'
            },
            gzip: true
        }, function (error, response, body) {
            var Obj = JSON.parse(body);
            message.channel.send(Obj.items[0].link);
        });
    },
    translate: function (args, message) {
        if (args[2] == 'to') {
            var from = args[1];
            from.toLowerCase();
            var to = args[3];
            to.toLowerCase();
            args.splice(0, 4);
            var s = args.join(' ');
            const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + credentials.api_keys.yandex_translate + '&text=' + s + '&lang=' + from + '-' + to;
            request(url, function (error, response, body) {
                var Obj = JSON.parse(body);
                message.channel.send('Translated:\n`' + Obj.text[0] + '`\n**Powered by Yandex.Translate**\nhttp://translate.yandex.com');
            });
        } else {
            message.channel.send('Invalid Syntax!');
        }
    },
    twitch: function (args, message) {
        var s;
        switch (args[1]) {
            case 'channel': {
                args.splice(0, 2);
                s = args.join('%20');
                s = s.replace(/,/g, '%2C');
                s = s.replace(/\|/g, '%7C');
                s = s.replace(/"/g, '%22');
                s = s.replace(/</g, '%3C');
                s = s.replace(/>/g, '%3E');
                s = s.replace(/#/g, '%23');
                s = s.replace(/%/g, '%25');
                const url = 'https://api.twitch.tv/kraken/search/channels?query=' + s + '&limit=1&client_id=' + credentials.api_keys.twitch;
                request(url, function (error, response, body) {
                    var Obj = JSON.parse(body);
                    message.channel.send(Obj.channels[0].url);
                });
                break;
            }
            case 'game': {
                args.splice(0, 2);
                s = args.join('%20');
                s = s.replace(/,/g, '%2C');
                s = s.replace(/\|/g, '%7C');
                s = s.replace(/"/g, '%22');
                s = s.replace(/</g, '%3C');
                s = s.replace(/>/g, '%3E');
                s = s.replace(/#/g, '%23');
                s = s.replace(/%/g, '%25');
                const url = 'https://api.twitch.tv/kraken/search/games?query=' + s + '&client_id=' + credentials.api_keys.twitch;
                request(url, function (error, response, body) {
                    var Obj = JSON.parse(body);
                    var x = Obj.games[0].name;
                    x = x.replace(/ /g, '%20');
                    x = x.replace(/,/g, '%2C');
                    x = x.replace(/\|/g, '%7C');
                    x = x.replace(/"/g, '%22');
                    x = x.replace(/</g, '%3C');
                    x = x.replace(/>/g, '%3E');
                    x = x.replace(/#/g, '%23');
                    x = x.replace(/%/g, '%25');
                    message.channel.send('https://www.twitch.tv/directory/game/' + x);
                });
                break;
            }
            case 'stream': {
                args.splice(0, 2);
                s = args.join('%20');
                s = s.replace(/,/g, '%2C');
                s = s.replace(/\|/g, '%7C');
                s = s.replace(/"/g, '%22');
                s = s.replace(/</g, '%3C');
                s = s.replace(/>/g, '%3E');
                s = s.replace(/#/g, '%23');
                s = s.replace(/%/g, '%25');
                const url = 'https://api.twitch.tv/kraken/search/streams?query=' + s + '&limit=1&client_id=' + credentials.api_keys.twitch;
                request(url, function (error, response, body) {
                    var Obj = JSON.parse(body);
                    message.channel.send('https://www.twitch.tv/' + Obj.streams[0].channel.name);
                });
                break;
            }
            default:
                message.channel.send('Invalid Syntax!');
        }
    },
    urban: function (args, message) {
        args.splice(0, 1);
        var s = args.join('%20');
        s = s.replace(/,/g, '%2C');
        s = s.replace(/\|/g, '%7C');
        s = s.replace(/"/g, '%22');
        s = s.replace(/</g, '%3C');
        s = s.replace(/>/g, '%3E');
        s = s.replace(/#/g, '%23');
        s = s.replace(/%/g, '%25');
        const url = 'https://api.urbandictionary.com/v0/define?term=' + s;
        request(url, function (error, response, body) {
            var Obj = JSON.parse(body);
            message.channel.send(Obj.list[0].permalink);
        });
    },
    weather: function (args, message) {
        args.splice(0, 1);
        var s = args.join('%20');
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + s + '&units=metric&APPID=' + credentials.api_keys.open_weather;
        request(url, function (error, response, body) {
            var Obj = JSON.parse(body);
            var sunrise = new Date(parseInt(Obj.sys.sunrise, 10) * 1000 + Obj.timezone / 1000);
            var sunrise_hour = sunrise.getHours();
            var sunrise_minute = '' + sunrise.getMinutes();
            var sunset = new Date(parseInt(Obj.sys.sunset, 10) * 1000 + Obj.timezone / 1000);
            var sunset_hour = sunset.getHours();
            var sunset_minute = '' + sunset.getMinutes();
            const current_weather = new Discord.RichEmbed()
                .setColor('#fcb103')
                .attachFiles(['./assets/images/open_weather_logo.png'])
                .setAuthor('Open Weather', 'attachment://open_weather_logo.png', 'https://openweathermap.org/')
                .setThumbnail('http://openweathermap.org/img/wn/' + Obj.weather[0].icon + '@2x.png')
                .setTitle('Weather in ' + Obj.name + ', ' + Obj.sys.country)
                .setDescription(Obj.main.temp + '°C')
                .setURL('https://openweathermap.org/city/' + Obj.id)
                .addField(Obj.weather[0].main, Obj.weather[0].description)
                .addField('Wind: ', 'Speed = ' + Obj.wind.speed + ' meters/sec, Direction = ' + Obj.wind.deg + '°', true)
                .addField('Cloudiness: ', Obj.clouds.all + '%', true)
                .addField('Pressure: ', Obj.main.pressure + ' hPa', true)
                .addField('Humidity: ', Obj.main.humidity + '%', true)
                .addField('Sunrise: ', sunrise_hour + ':' + sunrise_minute.substring(-2), true)
                .addField('Sunset: ', sunset_hour + ':' + sunset_minute.substring(-2), true)
                .addField('Geo Coordinates:', 'Lat: ' + Obj.coord.lat + ', Lon: ' + Obj.coord.lon, true)
                .setTimestamp()
                .setFooter('Data from: https://openweathermap.org', 'attachment://open_weather_logo.png');
            message.channel.send(current_weather);
        });
    },
    yt: function (args, message) {
        args.splice(0, 1);
        var s = args.join(' ');
        const url = 'https://www.googleapis.com/youtube/v3/search?q=' + s + '&part=snippet&maxResults=1&order=relevance&regionCode=US&safeSearch=moderate&key=' + credentials.api_keys.youtube;
        request(url, function (error, response, body) {
            var Obj = JSON.parse(body);
            if (Obj.items[0].id.channelId != undefined) {
                message.channel.send('https://www.youtube.com/channel/' + Obj.items[0].id.channelId);
            } else if (Obj.items[0].id.videoId != undefined) {
                message.channel.send('https://www.youtube.com/watch?v=' + Obj.items[0].id.videoId);
            }
        });
    }
};