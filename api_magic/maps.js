module.exports = {
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
    }
};