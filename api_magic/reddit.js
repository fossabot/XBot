'use strict';
const snoowrap = require('snoowrap');

const api_keys = require('../api_keys.json')

const r = new snoowrap({
    userAgent: 'xbot',
    clientId: api_keys.reddit.clientId,
    clientSecret: api_keys.reddit.clientSecret,
    refreshToken: api_keys.reddit.refreshToken
});

module.exports = {
    reddit: function (args, message) {
        args.splice(0, 1);
        var s = args.join("%20");
        if (s.startsWith("r/")) {
            if (s.endsWith("%20-s")) {
                r.getSubreddit(s.substring(2, s.length - 5)).getRandomSubmission().url.then(function (value) {
                    message.channel.send(value);
                });
            } else {
                message.channel.send('https://www.reddit.com/' + s);
            }
        } else {
            message.channel.send('https://www.reddit.com/search/?q=' + s);
        }
    }
}