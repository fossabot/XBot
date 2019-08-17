const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const credentials = require('../credentials.json');

const {
    md5,
    sha1,
    sha256
} = require('tiny-hashes');

function roman_to_decimal(c) {
    switch (c) {
        case 'M':
            return 1000;
        case 'D':
            return 500;
        case 'C':
            return 100;
        case 'L':
            return 50;
        case 'X':
            return 10;
        case 'V':
            return 5;
        case 'I':
            return 1;
    }
}

var decimal_value = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
var roman_value = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

module.exports = {
    base: function (args, message) {
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
    },
    color: function (args, message) {
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
    },
    currency: function (args, message) {
        if (args[3] == 'to') {
            var v = args[1];
            var from = args[2];
            from.toUpperCase();
            var to = args[4];
            to.toUpperCase();
            const Http = new XMLHttpRequest();
            const url = 'http://data.fixer.io/api/latest?access_key=' + credentials.api_keys.fixer_io + '&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYR,BYN,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL&format=1';
            Http.open('GET', url);
            Http.send();
            Http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var Obj = JSON.parse(this.responseText);
                    var val = parseFloat(v);
                    var fval = Obj.rates[from];
                    var tval = Obj.rates[to];
                    var res = val / fval * tval;
                    message.channel.send('Converted: ' + res + ' ' + to);
                }
            };
        } else {
            message.channel.send('Invalid Syntax!');
        }
    },
    hash: function (args, message) {
        args.splice(0, 1);
        var s = args.join(' ');
        message.channel.send('Hashed `' + s + '` :\n' + '```md5: ' + md5(s) + '\n' + 'sha1: ' + sha1(s) + '\n' + 'sha256: ' + sha256(s) + '```');
    },
    roman: function (args, message) {
        var s, i;
        if (args[1][0] >= 'A') {
            s = args[1];
            var val = 0;
            for (i = 0; i < s.length - 1; ++i) {
                if (roman_to_decimal(s[i]) >= roman_to_decimal(s[i + 1])) {
                    val += roman_to_decimal(s[i]);
                } else {
                    val -= roman_to_decimal(s[i]);
                }
            }
            val += roman_to_decimal(s[s.length - 1]);
            message.channel.send('Converted: ' + val);
        } else {
            s = parseInt(args[1]);
            var res = '';
            i = 0;
            while (s) {
                if (s >= decimal_value[i]) {
                    s -= decimal_value[i];
                    res += roman_value[i];
                } else {
                    ++i;
                }
            }
            message.channel.send('Converted: ' + res);
        }
    }
};