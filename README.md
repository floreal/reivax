# Reivax
## When Twitter meet IRC

This is just a poc so use it at your own risk !

It's first goal is to find tweet that match the track list and give them to me on IRC for practical reason.

### Get twitter authorizations

* go [here](https://apps.twitter.com/)
* after creating an app go grab
  * Consumer Key
  * Consumer Secret
  * Access Token
  * Access Token Secret

### Config

* rename the example.config.json file to config.json and read it !
* rename the example.mute_list.csv file to mute_list.csv and copy past your coma separated user to be mute

#### track_rules

A comma-separated list of phrases which will be used to determine what Tweets will be delivered on the stream. A phrase may be one or more terms separated by spaces, and a phrase will match if all of the terms in the phrase are present in the Tweet, regardless of order and ignoring case. By this model, you can think of commas as logical ORs, while spaces are equivalent to logical ANDs (e.g. ‘the twitter’ is the AND twitter, and ‘the,twitter’ is the OR twitter).

From the [Twitter API documentation](https://dev.twitter.com/streaming/overview/request-parameters#track)

### Run it and profit

`node reivax.js`