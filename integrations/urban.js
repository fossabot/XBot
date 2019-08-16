const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports = {
    urban : function(args, message) {
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
    }
};