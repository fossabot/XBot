const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const credentials = require('../credentials.json');

module.exports = {
    search: function (args, message) {
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