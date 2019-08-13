const {
    md5,
    sha1,
    sha256
} = require('tiny-hashes');

module.exports = {
    hash : function(args, message) {
        args.splice(0, 1);
        var s = args.join(" ");
        message.channel.send('Hashed `' + s + '` :\n' + '```md5: ' + md5(s) + '\n' + 'sha1: ' + sha1(s) + '\n' + 'sha256: ' + sha256(s) + '```');
    }
}