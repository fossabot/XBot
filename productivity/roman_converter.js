function RtD(c) {
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
    roman_converter: function (args, message) {
        if (args[1][0] >= 'A') {
            var s = args[1];
            var val = 0;
            for (var i = 0; i < s.length - 1; ++i) {
                if (RtD(s[i]) >= RtD(s[i + 1])) {
                    val += RtD(s[i]);
                } else {
                    val -= RtD(s[i]);
                }
            }
            val += RtD(s[s.length - 1]);
            message.channel.send("Converted: " + val);
        } else {
            var s = parseInt(args[1]);
            var res = '';
            var i = 0;
            while (s) {
                if (s >= decimal_value[i]) {
                    s -= decimal_value[i];
                    res += roman_value[i];
                } else {
                    ++i;
                }
            }
            message.channel.send("Converted: " + res);
        }
    }
}