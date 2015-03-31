var Twitter = require('twitter');
var fs      = require('fs');
var parse   = require('csv-parse');
var irc     = require('irc');

var ignores  = [];
var base_url = 'https://twitter.com/';
var config   = false;

var setup_mute = function(callback){
  fs.readFile('mute_list.csv', 'utf8', function (err,data) {
    parse(data, {}, function(err, output){
      output[0].forEach(function(elem){
        ignores.push(elem);
      });
    });
    setup_config();
  });
};

var setup_config = function(callback){
  fs.readFile('config.json', 'utf8', function(err, data){
    config = JSON.parse(data);
    app();
  });
};
 
var app = function(){
  var twitterClient = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
  });

  var ircClient = new irc.Client(config.irc_server, config.irc_reivax_user_name, {
    userName: config.irc_reivax_user_name,
    realName: config.irc_reivax_real_name
    // channels: ["#ionstream"]
  });

  ircClient.addListener('error', function(message) {
      console.log('error: ', message);
  });

  ircClient.on('registered', function(){
    console.log('registered');
    console.log(config.consumer_secret);
    console.log(twitterClient);
    // ircClient.send('nickserv', 'identify' ,'password');
    // ircClient.say("#ionstream", "awea, kivutar: Hi this is reivax bitchesss");

    console.log(config.track_rules);
    twitterClient.stream('statuses/filter', {track: config.track_rules},  function(stream){

      stream.on('data', function(tweet) {
        console.log('data !');

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
}

setup_mute();