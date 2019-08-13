const Discord = require('discord.js')
const logger = require('winston')
const auth = require('./auth.json')

var currency = require('./productivity/currency_converter')
var base = require('./productivity/base_converter')
var hash = require('./productivity/hash')
var roman = require('./productivity/roman_converter')

const client = new Discord.Client();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

client.once('ready', () => {
    console.log('Connected');
    console.log('Ready!');
});

client.login(auth.token);

client.on('message', message => {
    if (message.content.substring(0, 4) == 'xbot') {
        var args = message.content.substring(5).split(' ');
        var cmd = args[0];
        switch (cmd) {
            case 'help':
                message.channel.send('Hi! I am XBot! This is what I can do: \n currency_convert: Converts values from one currency to another: \n ```* currency_convert [value(FLOAT)] [fromCurerency(3 LETTER STRING)] [toCurrency(3 LETTER STRING)] ``` \n base_convert: Converts values from one base to another: \n ```* base_covert [value(INT)] [fromBase(2<=INT<=32)] [toBase(2<=INT<=32)] \n * base_covert [value(INT)] [fromBase(STRING={BIN,OCT,DEC,HEX})] [toBase(STRING={BIN,OCT,DEC,HEX})]``` \n hash: Hashes input using md5, sha1, and sha256: \n ```hash [input(STRING)]```');
                break;
            case 'currency_convert':
                currency.currency_convert(args, message);
                break;
            case 'base_convert':
                base.base_convert(args, message);
                break;
            case 'hash':
                hash.hash(args, message);
                break;
            case 'roman_convert':
                roman.roman_converter(args, message);
                break;
        }
    }
});