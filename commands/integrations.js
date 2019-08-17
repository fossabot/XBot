'use strict';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const snoowrap = require('snoowrap');

const credentials = require('../credentials.json');

module.exports = {
    dict: function (args, message) {
        args.splice(0, 1);
        var s = args.join('%20');
        message.channel.send('https://www.merriam-webster.com/dictionary/' + s);
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
            clientId: credentials.api_keys.reddit.client_id,
            clientSecret: credentials.api_keys.reddit.client_secret,
            refreshToken: credentials.api_keys.reddit.refresh_token
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
    translate: function (args, message) {
        if (args[2] == 'to') {
            var from = args[1];
            from.toLowerCase();
            var to = args[3];
            to.toLowerCase();
            args.splice(0, 4);
            var s = args.join(' ');
            const Http = new XMLHttpRequest();
            const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + credentials.api_keys.yandex_translate + '&text=' + s + '&lang=' + from + '-' + to;
            Http.open('GET', url);
            Http.send();
            Http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var Obj = JSON.parse(this.responseText);
                    message.channel.send('Translated:\n`' + Obj.text[0] + '`\n**Powered by Yandex.Translate**\nhttp://translate.yandex.com');
                }
            };
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
                const Http = new XMLHttpRequest();
                const url = 'https://api.twitch.tv/kraken/search/channels?query=' + s + '&limit=1&client_id=' + credentials.api_keys.twitch;
                Http.open('GET', url);
                Http.send();
                Http.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var Obj = JSON.parse(this.responseText);
                        message.channel.send(Obj.channels[0].url);
                    }
                };
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
                const Http = new XMLHttpRequest();
                const url = 'https://api.twitch.tv/kraken/search/games?query=' + s + '&client_id=' + credentials.api_keys.twitch;
                Http.open('GET', url);
                Http.send();
                Http.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var Obj = JSON.parse(this.responseText);
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
                    }
                };
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
                const Http = new XMLHttpRequest();
                const url = 'https://api.twitch.tv/kraken/search/streams?query=' + s + '&limit=1&client_id=' + credentials.api_keys.twitch;
                Http.open('GET', url);
                Http.send();
                Http.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var Obj = JSON.parse(this.responseText);
                        message.channel.send('https://www.twitch.tv/' + Obj.streams[0].channel.name);
                    }
                };
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
        const Http = new XMLHttpRequest();
        const url = 'https://api.urbandictionary.com/v0/define?term=' + s;
        Http.open('GET', url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var Obj = JSON.parse(this.responseText);
                message.channel.send(Obj.list[0].permalink);
            }
        };
    },
    yt: function (args, message) {
        args.splice(0, 1);
        var s = args.join(' ');
        const Http = new XMLHttpRequest();
        const url = 'https://www.googleapis.com/youtube/v3/search?q=' + s + '&part=snippet&maxResults=1&order=relevance&regionCode=US&safeSearch=moderate&key=' + credentials.api_keys.youtube;
        Http.open('GET', url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var Obj = JSON.parse(this.responseText);
                if (Obj.items[0].id.channelId != undefined) {
                    message.channel.send('https://www.youtube.com/channel/' + Obj.items[0].id.channelId);
                } else if (Obj.items[0].id.videoId != undefined) {
                    message.channel.send('https://www.youtube.com/watch?v=' + Obj.items[0].id.videoId);
                }
            }
        };
    }
};