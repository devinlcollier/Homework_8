require("dotenv").config();
const keys = require("./keys.js");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

const arg = process.argv[2];

if (arg.startsWith("my-tweets")) {
    var params = { screen_name: "GoToInstagram" };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
        	let limit = tweets.length;
        	if(limit > 20)
        	{
        		limit = 20;
        	}

        	for(let i = 0; i < limit; i++)
        	{
        		console.log(tweets[i].created_at);
        		console.log(tweets[i].text);
        		console.log("\n\n");
        	}
        }
    });
} else if (arg.startsWith("spotify-this-song")) {
	let song = "";
	for(let i = 3; i < process.argv.length - 1; i++)
	{
		song += process.argv[i] + " ";
	}
	song += process.argv[process.argv.length - 1];

	spotify.search({ type: 'track', query: song }, function(err, data) {
	    if (err) {
	        return console.log('Error occurred: ' + err);
	    }
	    console.log("Artist: " + data.tracks.items[0].artists[0].name);
	    console.log("Song name: " + data.tracks.items[0].name);
	    console.log("URL: " + data.tracks.items[0].external_urls.spotify);
	    console.log("Album: " + data.tracks.items[0].album.name);
	});
} else if (arg.startsWith("movie-this")) {
	let movie = "";
	for(let i = 3; i < process.argv.length - 1; i++)
	{
		movie += process.argv[i] + " ";
	}
	movie += process.argv[process.argv.length - 1];

} else if (arg.startsWith("do-what-it-says")) {

}