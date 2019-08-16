var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const api_keys = require('../api_keys.json');

module.exports = {
    translate: function (args, message) {
        if (args[2] == 'to') {
            var from = args[1];
            from.toLowerCase();
            var to = args[3];
            to.toLowerCase();
            args.splice(0, 4);
            var s = args.join(' ');
            const Http = new XMLHttpRequest();
            const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + api_keys.yandex + '&text=' + s + '&lang=' + from + '-' + to;
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
    }
};