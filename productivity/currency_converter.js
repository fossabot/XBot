var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const api_keys = require('../api_keys.json')

module.exports = {
    currency_convert: function (args, message) {
        if (args[3] == 'to') {
            var v = args[1];
            var from = args[2];
            from.toUpperCase();
            var to = args[4];
            to.toUpperCase();
            const Http = new XMLHttpRequest();
            const url = 'http://data.fixer.io/api/latest?access_key=' + api_keys.fixer + '&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYR,BYN,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL&format=1';
            Http.open("GET", url);
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
            }
        } else {
            message.channel.send('Invalid Syntax!');
        }
    }
}