module.exports = {
    base_convert: function (args, message) {
        if (args[3] == 'to') {
            var v = args[1];
            var from, to;
            if (args[2] == 'BIN' || args[2] == 'OCT' || args[2] == 'DEC' || args[2] == 'HEX') {
                switch (args[2]) {
                    case 'BIN':
                        from = 2;
                        break;
                    case 'OCT':
                        from = 8;
                        break;
                    case 'DEC':
                        from = 10;
                        break;
                    case 'HEX':
                        from = 16;
                        break;
                }
                switch (args[4]) {
                    case 'BIN':
                        to = 2;
                        break;
                    case 'OCT':
                        to = 8;
                        break;
                    case 'DEC':
                        to = 10;
                        break;
                    case 'HEX':
                        to = 16;
                        break;
                }
            } else {
                from = parseFloat(args[2]);
                to = parseFloat(args[4]);
                if (from < 2 || from > 32 || to < 2 || to > 32) {
                    message.channel.send('Invalid Syntax!');
                }
            }
            v = parseInt(v, from);
            message.channel.send('Converted: ' + v.toString(to));
        } else {
            message.channel.send('Invalid Syntax!');
        }
    }
};