module.exports = {
    color_convert: function (args, message) {
        if (args[3] == 'to') {
            var v = args[1];
            var from = args[2];
            from.toUpperCase();
            var to = args[4];
            to.toUpperCase();
            var res, s;
            if (from == 'HEX' && to == 'RGB') {
                v = v.replace('#', '');
                res = '(';
                s = v.substring(0, 2);
                s = parseInt(s, 16);
                res += (s + ',');
                s = v.substring(2, 4);
                s = parseInt(s, 16);
                res += (s + ',');
                s = v.substring(4);
                s = parseInt(s, 16);
                res += s;
                res += ')';
                message.channel.send('Converted: ' + res);
            } else if (from == 'RGB' && to == 'HEX') {
                v = v.replace('(', '');
                v = v.replace(')', '');
                v = v.replace(/,/g, '');
                res = '#';
                s = parseInt(v.substring(0, 3), 10);
                s = s.toString(16);
                res += s;
                s = parseInt(v.substring(3, 6), 10);
                s = s.toString(16);
                res += s;
                s = parseInt(v.substring(6), 10);
                s = s.toString(16);
                res += s;
                message.channel.send('Converted: ' + res.toUpperCase());
            } else {
                message.channel.send('Invalid Syntax!');
            }
        }
    }
};