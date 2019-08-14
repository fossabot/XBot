var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const api_keys = require('../api_keys.json')

module.exports = {
    search: function (args, message) {
        var s = "";
        for (var i = 1; i < args.length; ++i) {
            s += args[i];
        }
        var Http = new XMLHttpRequest();
        var url = 'https://www.googleapis.com/youtube/v3/search?q=' + s + '&part=snippet&maxResults=1&order=relevance&key=' + api_keys.google;
        Http.open("GET", url);
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
        }
    }
}