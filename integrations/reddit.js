'use strict';
const snoowrap = require('snoowrap');

const credentials = require('../credentials.json');

const r = new snoowrap({
    userAgent: 'XBot',
    clientId: credentials.api_keys.reddit.client_id,
    clientSecret: credentials.api_keys.reddit.client_secret,
    refreshToken: credentials.api_keys.reddit.refresh_token
});

module.exports = {
    reddit: function (args, message) {
        args.splice(0, 1);
        var s = args.join('%20');
        if (s.startsWith('r/')) {
            if (s.endsWith('%20-s')) {
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
};