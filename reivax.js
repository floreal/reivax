var Twitter = require('twitter');
var fs      = require('fs');
var parse   = require('csv-parse');
var irc     = require('irc');

var ignores  = [];
var base_url = 'https://twitter.com/';
var config   = false;

fs.readFile('mute_list.csv', 'utf8', function (err,data) {
  parse(data, {}, function(err, output){
    output[0].forEach(function(elem){
      ignores.push(elem);
    });
  });
});

fs.readFile('config.json', 'utf8', function(err, data){
  config = JSON.parse(data);
  console.log(data);
});
 
var twitterClient = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

var ircClient = new irc.Client(config.irc_server, config.irc_reivax_user_name, {
  userName: config.irc_reivax_user_name,
  realName: config.irc_reivax_real_name
});

ircClient.addListener('error', function(message) {
    console.log('error: ', message);
});

ircClient.on('registered', function(){
  twitterClient.stream('statuses/filter', {track: config.track_rules},  function(stream){

    stream.on('data', function(tweet) {
      if (ignores.indexOf(tweet.user.screen_name) < 0) {
        message = base_url + tweet.user.screen_name + '/status/' + tweet.id_str;
        ircClient.say(config.irc_user_to_pm, message);
      }
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });
});