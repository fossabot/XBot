# XBot
![](assets/images/icon_128x128.png)

*A Useful Discord Bot*

### Technical Details:
* Made using [discord.js](https://discord.js.org) in [Node.js](https://nodejs.org/en/)
* Uses a [PostgreSQL Database](https://www.postgresql.org/) for storing server specific configs
* Deployed on [Heroku](https://www.heroku.com/)

## Commands

### Discord

#### *avatar*
* **`avatar {user mention}` to display a user's avatar**

* **`avatar` to display your own avatar**

#### *ban*
* **`ban {member mention}` to ban a member**

#### *kick*
* **`kick {member mention}` to kick a member**

#### *nick*
* **`nick {member mention} {new nickname}` to nickname a member**

### Fun

#### *ping*
* **`ping` to get a "pong" reply**

### Integrations

#### *dict*
* **`dict {word(s)}` to get the definition of a word(s) from [the Merriam-Webster](https://www.merriam-webster.com/) dictionary**

#### *imdb*
* **`imdb {movie title}` to search for a movie on [IMDb](https://www.imdb.com/)**

#### *imgur*
* **imgur {[OPTIONAL] time (default)| viral | top} {[OPTIONAL] (if top) -> day | week | month | year | all (default)} {search term(s)}` to search images on [Imgur](https://imgur.com)**

#### *maps*
* **`maps {[OPTIONAL] alg1 (default) | alg2} {location}` to display the map of a location from [Google Maps](https://www.google.com/maps/).
*You can specify which algorithm to use (in case the other one fails)***

#### *reddit*
> To display results from [reddit](https://www.reddit.com/)
* **`reddit -rand {r/subredditName}`**
* **`reddit {-hot | -new | -rising} {r/subredditName}`**
* **`reddit {-top | -controversial} {[OPTIONAL] -hour | -day | -week | -month | -year | -all (default)} {r/subredditName}`**
* **`reddit sub {r/subredditName}`**
* **`reddit search {search term}`**

#### *stackex*
* **`stackex {[OPTIONAL] site (default:stackoverflow)} {[OPTIONAL] -activity | -creation | -votes | -relevance (default)} {[OPTIONAL -asc | -desc (default)]} {search term}` to search a question on one of the [Stack Exchange Sites](https://stackexchange.com/sites)**

#### *translate*
* **`translate {langFrom} to {langTo} {word/sentences}` to translate words and sentences between languages**  
**Powered by Yandex.Translate**  
**http://translate.yandex.com**

#### *twitch*
* **`twitch {channel | game | stream} {channelName | gameName | streamName}` to search for a channel, game or stream on [Twitch](https://www.twitch.tv/)**

#### *urban*
* **`urban rand` to display a random definition from the [Urban Dictionary](https://www.urbandictionary.com/)**
* **`urban def {word/sequence}` to display the definition of a specific word or sequence from the [Urban Dictionary](https://www.urbandictionary.com/)**

#### *weather*
* **`weather {location}` to display a detailed embed of location's weather using [Open Weather](https://openweathermap.org/)**

#### *yt*
* **`yt {search term}` to display the most relevant search result from [YouTube](https://www.youtube.com/) (can be a video, a channel, a topic or a live stream)**

### Productivity

#### *base*
* **`base {value} {baseFrom} to {baseTo}` to convert between bases**.
**baseTo and baseFrom can be numbers between 2 and 36 or one of these strings: 'BIN', 'OCT', 'DEC', 'HEX'**

#### *calc*
* **`calc {math expression}` to evaluate a mathematical expression using [MathJS](https://mathjs.org/)**  
***A valid expression must use this expression syntax: https://mathjs.org/docs/expressions/syntax.html***

#### *color*
* **`color {HEX value | RGB value}` to convert a color value between HEX and RGB (the type is auto-detected)**

#### *currency*
* **`currency {value} {codeFrom} to {codeTo}` to convert between currencies using [Fixer.io](https://fixer.io/)**  
**List of supported currencies: https://fixer.io/symbols**

#### *hash*
* **`hash {sequence}` to hash a sequence of characters(can contain spaces) using md5, sha1 and sha256**

#### *roman*
* **`roman {roman numeral | decimal number}` to convert a number (the type is auto-detected)**

### Utility

#### *disable*
* **`disable {command}` to disable a command**
* **`enable {command}` to enable a command**

#### *help*
* **`help` to display a help embed**
* **`help` {category} to display the list of commands from a category**

#### *prefix*
* **`prefix {new prefix}` to change the prefix**
