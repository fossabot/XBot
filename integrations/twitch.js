const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const api_keys = require('../api_keys.json');

module.exports = {
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
                const url = 'https://api.twitch.tv/kraken/search/channels?query=' + s + '&limit=1&client_id=' + api_keys.twitch;
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
                const url = 'https://api.twitch.tv/kraken/search/games?query=' + s + '&client_id=' + api_keys.twitch;
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
                const url = 'https://api.twitch.tv/kraken/search/streams?query=' + s + '&limit=1&client_id=' + api_keys.twitch;
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
    }
};