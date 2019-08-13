module.exports = {
    base_convert : function(args, message) {
        if (args[3] == 'to') {
            var v = args[1];
            if (args[2] == 'BIN' || args[2] == 'OCT' || args[2] == 'DEC' || args[2] == 'HEX') {
                switch (args[2]) {
                    case 'BIN':
                        var from = 2;
                    case 'OCT':
                        var from = 8;
                    case 'DEC':
                        var from = 10;
                    case 'HEX':
                        var from = 16;
                }
                switch (args[4]) {
                    case 'BIN':
                        var to = 2;
                    case 'OCT':
                        var to = 8;
                    case 'DEC':
                        var to = 10;
                    case 'HEX':
                        var to = 16;
                }
            } else {
                var from = parseFloat(args[2]);
                var to = parseFloat(args[4]);
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
}