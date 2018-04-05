require("dotenv").config();
const keys = require("./keys.js");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

const arg = process.argv[2];

let logs = [];

function log(log) {
    console.log(log);
    logs.push(log);
}

if (arg.startsWith("my-tweets")) {
    my_tweets();
} else if (arg.startsWith("spotify-this-song")) {
    spotify_this_song(process.argv);
} else if (arg.startsWith("movie-this")) {
    movie_this(process.argv);
} else if (arg.startsWith("do-what-it-says")) {
    fs.readFile("random.txt", "utf8", (err, data) => {
    	if(err)
    	{
    		throw err;
    	}
        let args = [0, 0].concat(data.split(" "));
        if (args[2].startsWith("my-tweets")) {
            my_tweets();
        } else if (args[2].startsWith("spotify-this-song")) {
            spotify_this_song(args);
        } else if (args[2].startsWith("movie-this")) {
            movie_this(args);
        }
    });
}

function my_tweets() {
    let params = { screen_name: "GoToInstagram" };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            let limit = tweets.length;
            if (limit > 20) {
                limit = 20;
            }

            for (let i = 0; i < limit; i++) {
                log(tweets[i].created_at);
                log(tweets[i].text);
                log("\n\n");
            }
        }
    });
}

function spotify_this_song(array) {
    let song = "";
    for (let i = 3; i < array.length - 1; i++) {
        song += array[i] + " ";
    }
    song += array[array.length - 1];

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        log("Artist: " + data.tracks.items[0].artists[0].name);
        log("Song name: " + data.tracks.items[0].name);
        log("URL: " + data.tracks.items[0].external_urls.spotify);
        log("Album: " + data.tracks.items[0].album.name);
    });
}

function movie_this(array) {
    let movie = "";
    for (let i = 3; i < array.length - 1; i++) {
        movie += array[i] + " ";
    }
    movie += array[array.length - 1];

    const url = "http://www.omdbapi.com/?apikey=" + "trilogy" + "&t=" + movie;

    request(url, function(error, response, resBody) {
        const body = JSON.parse(resBody);
        log("Title: " + body.Title);
        log("Released: " + body.Released);
        log("IMDB Rating: " + body.Ratings[0].Value);
        log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
        log("Produced in: " + body.Country);
        log("Language: " + body.Language);
        log("Plot: " + body.Plot);
        log("Cast: " + body.Actors);
    });
}

process.on("exit", (code) => {
    fs.appendFileSync("log.txt", logs.join("\r\n"));
});