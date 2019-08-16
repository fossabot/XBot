module.exports = {
    dictionary: function (args, message) {
        args.splice(0, 1);
        var s = args.join('%20');
        message.channel.send('https://www.merriam-webster.com/dictionary/' + s);
    }
};