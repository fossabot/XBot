/* eslint-disable sort-keys */
const Discord = require('discord.js');
const request = require('request');
const math = require('mathjs');

const credentials = require('../credentials.json');

const {md5, sha1, sha256} = require('tiny-hashes');

module.exports = {
  base (args, message) {
    if (args[3] == 'to') {
      let v = args[1];
      let from, to;
      if (args[2] == 'BIN' || args[2] == 'OCT' || args[2] == 'DEC' || args[2] == 'HEX') {
        // eslint-disable-next-line default-case
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
        // eslint-disable-next-line default-case
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
        if (from < 2 || from > 32 || to < 2 || to > 32) message.channel.send('Invalid Syntax!');
      }
      v = parseInt(v, from);
      message.channel.send(`Converted: ${v.toString(to)}`);
    } else {
      message.channel.send('Invalid Syntax!');
    }
  },
  calc (args, message) {
    args.splice(0, 1).join(' ');
    const s = args.join(' ');
    let res;
    try {
      res = math.evaluate(s);
    } catch (err) {
      message.channel.send('Invalid Syntax! Try:\n`calc {math expression}` to evaluate a mathematical expression\n**A valid expression must use this expression syntax:**\nhttps://mathjs.org/docs/expressions/syntax.html');
    }
    if (typeof res != 'object') message.channel.send(res);
    else if (Object.prototype.hasOwnProperty.call(res, 're'))
      if (res.re) message.channel.send(`${res.re} + ${res.im}i`);
      else if (res.im > 1) message.channel.send(`${res.im}i`);
      else message.channel.send('i');
    else if (Object.prototype.hasOwnProperty.call(res, 'value'))
      message.channel.send(math.chain(res.value).multiply(100).value);
  },
  color (args, message) {
    let v = args[1];
    if (args.length > 2) {
      message.channel.send('Invalid Syntax! Try:\n`color {HEX value | RGB value}` to convert a color value between HEX and RGB (the type is auto-detected)');
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
      message.channel.send('Invalid Syntax! Try:\n`color {HEX value | RGB value}` to convert a color value between HEX[e.g. #FFFFFF] and RGB[e.g. rgb(255,255,255)] (the type is auto-detected)');
    }
  },
  currency (args, message) {
    if (args[3] == 'to') {
      const v = args[1];
      const from = args[2];
      from.toUpperCase();
      const to = args[4];
      to.toUpperCase();
      const url = `http://data.fixer.io/api/latest?access_key=${
        credentials.apiKeys.fixerIO
      }&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYR,BYN,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL&format=1`;
      request(url, (error, response, body) => {
        const Obj = JSON.parse(body);
        const val = parseFloat(v);
        const fval = Obj.rates[from];
        const tval = Obj.rates[to];
        const res = val / fval * tval;
        message.channel.send(`Converted: ${res} ${to}`);
      });
    } else {
      message.channel.send('Invalid Syntax!');
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
      message.channel.send('Invalid Syntax! You didn\'t provide anything to hash. Try:\n`hash {string}` to hash a sequence of characters(can contain spaces) using md5, sha1 and sha256');
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
    const isRoman = [...args[1]].every((char) => Object.prototype.hasOwnProperty.call(romanToDecimal, char));
    if (args.length > 2) {
      message.channel.send('Invalid Syntax! Try:\n`roman {roman numeral | decimal number}` to convert between roman numerals and decimal numbers (the type is auto-detected)');
    } else if (isRoman) {
      const s = args[1];
      let val = 0;
      for (let i = 0; i < s.length - 1; ++i)
        if (romanToDecimal[s[i]] >= romanToDecimal[s[i + 1]]) val += romanToDecimal[s[i]];
        else val -= romanToDecimal[s[i]];
      val += romanToDecimal[s[s.length - 1]];
      message.channel.send(`Converted to a decimal number:\n\`${val}\``);
    } else if (isNaN(args[1])) {
      message.channel.send('Invalid Syntax! Try:\n`roman {roman numeral | decimal number}` to convert between roman numerals and decimal numbers (the type is auto-detected)');
    } else {
      const decimalValue = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      const romanValue = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
      let s = parseInt(args[1], 10);
      let res = '';
      let i = 0;
      while (s)
        if (s >= decimalValue[i]) {
          s -= decimalValue[i];
          res += romanValue[i];
        } else {
          ++i;
        }
      message.channel.send(`Converted to a roman numeral:\n\`${res}\``);
    }
  },
};
