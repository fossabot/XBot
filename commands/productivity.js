/* eslint-disable sort-keys */
const Discord = require('discord.js');
const request = require('request');
const math = require('mathjs');

require('dotenv').config();

const {md5, sha1, sha256} = require('tiny-hashes');

module.exports = {
  base (args, message) {
    if (args.length != 5 || args[3].toLowerCase() != 'to' || isNaN(args[1])) {
      message.channel.send('Invalid Syntax! Try:\n* **`base <value> <base> to <base>`**\n  - **where `<value>` must be a positive integer, NOT a floating point number**\n  - **where `<base>` must be a number between 2 and 36 (inclusive) or `BIN | OCT | DEC | HEX`**\n  - **to convert between bases**');
    } else {
      const baseValues = {
        BIN: 2,
        OCT: 8,
        DEC: 10,
        HEX: 16,
      };
      const v = args[1];
      let from, to;
      args[2] = args[2].toUpperCase();
      args[4] = args[4].toUpperCase();
      const inRange = (val, min, max) => val >= min && val <= max;
      if (Object.prototype.hasOwnProperty.call(baseValues, args[2])) {
        from = baseValues[args[2]];
      } else if (!isNaN(args[2])) {
        from = parseFloat(args[2]);
      }
      if (Object.prototype.hasOwnProperty.call(baseValues, args[4])) {
        to = baseValues[args[4]];
      } else if (!isNaN(args[4])) {
        to = parseFloat(args[4]);
      }
      if (!inRange(from, 2, 36) || !inRange(to, 2, 36)) {
        message.channel.send('Invalid Syntax! Try:\n* **`base <value> <base> to <base>`**\n  - **where `<value>` must be a positive integer, NOT a floating point number**\n  - **where `<base>` must be a number between 2 and 36 (inclusive) or `BIN | OCT | DEC | HEX`**\n  - **to convert between bases**');
        return;
      }
      message.channel.send(`Converted: ${parseInt(v, from).toString(to)}`);
    }
  },
  calc (args, message) {
    args.splice(0, 1);
    const s = args.join(' ');
    if (!s) {
      message.channel.send('Invalid Syntax! Try:\n* **`calc <mathematical expression>`**\n  - **where `<mathematical expression>` must be a valid mathematical expression, according to https://mathjs.org/docs/expressions/syntax.html**\n  - **to evaluate a mathematical expression using MathJS: https://mathjs.org/**');
      return;
    }
    let res;
    try {
      res = math.evaluate(s);
    } catch (err) {
      message.channel.send('Invalid Syntax! Try:\n* **`calc <mathematical expression>`**\n  - **where `<mathematical expression>` must be a valid mathematical expression, according to https://mathjs.org/docs/expressions/syntax.html**\n  - **to evaluate a mathematical expression using MathJS: https://mathjs.org/**');
    }
    if (typeof res != 'object') {
      message.channel.send(res);
    } else if (Object.prototype.hasOwnProperty.call(res, 're')) {
      if (res.re) {
        message.channel.send(`${res.re} + ${res.im}i`);
      } else if (res.im > 1) {
        message.channel.send(`${res.im}i`);
      } else {
        message.channel.send('i');
      }
    } else if (Object.prototype.hasOwnProperty.call(res, 'value')) {
      message.channel.send(math.chain(res.value).multiply(100).value);
    }
  },
  color (args, message) {
    let v = args[1];
    if (args.length != 2) {
      message.channel.send('Invalid Syntax! Try:\n* **`color <HEX value | RGB value>`**\n  - **where `<HEX value>` must be a valid HEX color, examples: #000000 or #FFFFFF**\n  - **where `<RGB value>` must be a valid RGB color, examples: rgb(0,0,0) or rgb(255,255,255)**\n  - **to convert a color value between HEX and RGB (the type is auto-detected)**');
    } else if (v[0] === '#' && ([3, 4, 6, 8].indexOf(v.substring(1).length) > -1 && !isNaN(parseInt(v.substring(1), 16)))) {
      v = v.substring(1);
      let res = 'rgb(';
      let s = parseInt(v.substring(0, 2), 16);
      res += `${s},`;
      s = parseInt(v.substring(2, 4), 16);
      res += `${s},`;
      s = parseInt(v.substring(4), 16);
      res += `${s})`;
      message.channel.send(`Converted to RGB:\n\`${res}\``);
    } else if (
      (/^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/u).test(v)
    ) {
      v = v
        .substring(3)
        .replace('(', '')
        .replace(')', '')
        .replace(/,/gu, '');
      let res = '#';
      let s = parseInt(v.substring(0, 3), 10).toString(16);
      res += s;
      s = parseInt(v.substring(3, 6), 10).toString(16);
      res += s;
      s = parseInt(v.substring(6), 10).toString(16);
      res += s;
      res = res.toUpperCase();
      message.channel.send(`Converted to HEX:\n\`${res}\``);
    } else {
      message.channel.send('Invalid Syntax! Try:\n* **`color <HEX value | RGB value>`**\n  - **where `<HEX value>` must be a valid HEX color, examples: #000000 or #FFFFFF**\n  - **where `<RGB value>` must be a valid RGB color, examples: rgb(0,0,0) or rgb(255,255,255)**\n  - **to convert a color value between HEX and RGB (the type is auto-detected)**');
    }
  },
  currency (args, message) {
    if (args.length != 5 || args[3].toLowerCase() != 'to' || isNaN(args[1])) {
      message.channel.send('Invalid Syntax! Try:\n* **`currency <value> <code> to <code>`**\n  - **where `<code>` must be a valid code from https://fixer.io/symbols**\n  - **to convert between currencies using Fixer.io: https://fixer.io/**');
    } else {
      const v = args[1];
      const from = args[2].toUpperCase();
      const to = args[4].toUpperCase();
      const url = `http://data.fixer.io/api/latest?access_key=${process.env.API_KEYS_FIXERIO}&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYR,BYN,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL&format=1`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        const val = parseFloat(v);
        if (Object.prototype.hasOwnProperty.call(Obj.rates, from) && Object.prototype.hasOwnProperty.call(Obj.rates, to)) {
          const fval = Obj.rates[from];
          const tval = Obj.rates[to];
          const res = val / fval * tval;
          message.channel.send(`Converted:\n\`${res} ${to}\``);
        } else {
          message.channel.send('Invalid Syntax! Try:\n* **`currency <value> <code> to <code>`**\n  - **where `<code>` must be a valid code from https://fixer.io/symbols**\n  - **to convert between currencies using Fixer.io: https://fixer.io/**');
        }
      });
    }
  },
  hash (args, message) {
    if (args.length > 1) {
      args.splice(0, 1);
      const s = args.join(' ');
      const hashes = new Discord.RichEmbed()
        .setColor('#0000ff')
        .attachFiles(['./assets/images/icon.png'])
        .setAuthor('XBot', 'attachment://icon.png', 'https://github.com/paul-soporan/XBot')
        .setTitle('Hashed:')
        .setDescription(`\`${s}\``)
        .setURL()
        .addField('md5:', md5(s))
        .addField('sha1:', sha1(s))
        .addField('sha256:', sha256(s))
        .setTimestamp()
        .setFooter('Hashed using: https://github.com/jbt/tiny-hashes');
      message.channel.send(hashes);
    } else {
      message.channel.send('Invalid Syntax! You didn\'t provide the sequence to hash. Try:\n* **`hash <sequence>`**\n  - **to hash a sequence of characters using md5, sha1 and sha256**');
    }
  },
  roman (args, message) {
    const romanToDecimal = {
      M: 1000,
      D: 500,
      C: 100,
      L: 50,
      X: 10,
      V: 5,
      I: 1,
    };
    if (args.length != 2) {
      message.channel.send('Invalid Syntax! Try:\n* **`roman <roman numeral | decimal number>`**\n  - **where `<roman numeral>` must be a valid roman numeral**\n  - **where `<decimal number>` must be a positive integer, NOT a floating point number**\n  - **to convert a number (the type is auto-detected)**');
      return;
    }
    const isRoman = [...args[1]].every((char) => Object.prototype.hasOwnProperty.call(romanToDecimal, char));
    if (isRoman) {
      const s = args[1];
      let val = 0;
      for (let i = 0; i < s.length - 1; ++i) {
        if (romanToDecimal[s[i]] >= romanToDecimal[s[i + 1]]) {
          val += romanToDecimal[s[i]];
        } else {
          val -= romanToDecimal[s[i]];
        }
      }
      val += romanToDecimal[s[s.length - 1]];
      message.channel.send(`Converted to a decimal number:\n\`${val}\``);
    } else if (isNaN(args[1])) {
      message.channel.send('Invalid Syntax! Try:\n* **`roman <roman numeral | decimal number>`**\n  - **where `<roman numeral>` must be a valid roman numeral**\n  - **where `<decimal number>` must be a positive integer, NOT a floating point number**\n  - **to convert a number (the type is auto-detected)**');
    } else {
      const decimalValue = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      const romanValue = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
      let s = parseInt(args[1], 10);
      let res = '';
      let i = 0;
      while (s) {
        if (s >= decimalValue[i]) {
          s -= decimalValue[i];
          res += romanValue[i];
        } else {
          ++i;
        }
      }
      message.channel.send(`Converted to a roman numeral:\n\`${res}\``);
    }
  },
};
