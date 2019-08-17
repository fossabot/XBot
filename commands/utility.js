module.exports = {
    disable: function (args, message, con, disabled_string) {
        if (args[1] == 'enable' || args[1] == 'disable') {
            message.channel.send('`enable` and `disable` can\'t be disabled!');
        } else if (message.member.hasPermission('MANAGE_GUILD')) {
            if (!disabled_string.includes(args[1])) {
                var sql = 'UPDATE servers SET disabled = \'' + disabled_string + args[1] + ' \' WHERE id = \'' + message.guild.id + '\'';
                con.query(sql, function (err) {
                    if (err) throw err;
                    message.channel.send('Succesfully disabled: `' + args[1] + '`');
                });
            } else {
                message.channel.send('This command is already disabled!');
            }
        } else {
            message.channel.send('You don\'t have the necessary permissions!');
        }
    },
    enable: function (args, message, con, disabled_string) {
        if (args[1] == 'enable' || args[1] == 'disable') {
            message.channel.send('`enable` and `disable` can\'t be enabled!');
        } else if (message.member.hasPermission('MANAGE_GUILD')) {
            if (disabled_string.includes(args[1])) {
                disabled_string = disabled_string.replace(args[1], '');
                disabled_string = disabled_string.replace(/\s+/g, ' ');
                var sql = 'UPDATE servers SET disabled = \'' + disabled_string + '\' WHERE id = \'' + message.guild.id + '\'';
                con.query(sql, function (err) {
                    if (err) throw err;
                    message.channel.send('Succesfully enabled: `' + args[1] + '`');
                });
            } else {
                message.channel.send('This command is not disabled!');
            }
        } else {
            message.channel.send('You don\'t have the necessary permissions!');
        }
    },
    help: function (message) {
        message.channel.send('Hi! I am XBot! This is what I can do:\ncurrency_convert: Converts values from one currency to another:\n```* currency_convert [value(FLOAT)] [fromCurerency(3 LETTER STRING)] [toCurrency(3 LETTER STRING)] ```\nbase_convert: Converts values from one base to another:\n```* base_convert [value(INT)] [fromBase(2<=INT<=32)] [toBase(2<=INT<=32)]\n```\n```* base_convert [value(INT)] [fromBase(STRING={BIN,OCT,DEC,HEX})] [toBase(STRING={BIN,OCT,DEC,HEX})]```\nhash: Hashes input using md5, sha1, and sha256:\n```hash [input(STRING)]```\nroman_convert: Works both ways:\n```* roman_convert [DECIMAL_NUMBER|ROMAN_NUMBER]\n```\ncolor_convert: Converts color values between HEX and RBG. Works both ways:\n```* color_convert [HEX(#000000)|RGB((0,0,0)) Value] [HEX|RGB] to [HEX|RGB]```');
    },
    prefix: function (args, message, con) {
        if (message.member.hasPermission('MANAGE_GUILD')) {
            var sql = 'UPDATE servers SET prefix = \'' + args[1] + '\' WHERE id = \'' + message.guild.id + '\'';
            con.query(sql, function (err) {
                if (err) throw err;
            });
            message.channel.send('Changed prefix to: `' + args[1] + '`');
        } else {
            message.channel.send('You don\'t have the necessary permissions!');
        }
    }
};