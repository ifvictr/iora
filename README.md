<p align="center">
    <img alt="iora logo" width="400" src="https://files.ifvictr.com/2020/08/iora_card.png" />
</p>
<p align="center">
    Listen to music generated from new tweets on Twitter.
</p>

![iora screenshot](https://files.ifvictr.com/2020/08/iora_screenshot.png)

Iora is inspired by [@debugger22](https://github.com/debugger22)’s [GitHub Audio](https://github.com/debugger22/github-audio). I had it playing in the background at one point while working on this. 😄

## How it works

Each incoming tweet is converted into a note and duration pair. There are five different types a tweet can be classified as: new tweet, retweet, reply, poll, and media (images, videos, GIFs), and a note is assigned according to that. The duration is calculated by dividing the tweet length by 70 (the amount of characters per fourth of a tweet at max length).

## Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Setup

Iora is composed of three components:

1. A **Twitter app** registered through the Twitter Developer Portal, which is used to access data from the platform
2. A **Node.js WebSockets server** which interfaces with Twitter’s stream API via a long-lived HTTP connection. Received messages are re-broadcasted to all connected clients as WebSocket messages. This is necessary because Twitter restricts apps to one concurrent connection.
3. A **React.js frontend** for music generation and displaying received data

### Creating the Twitter app

1. Go to Twitter’s [Developer Portal](https://developer.twitter.com/en/portal/dashboard) and create a new app. Make sure the app is compatible with Twitter’s API V2.
2. Go to **Keys and tokens** and note down the value of **Bearer token**.

### Environment variables

Here are all the variables you need to set up on the server, with hints.

```bash
# Port to run the server on.
PORT=3000

# The URL to prepend to all built assets that'll be served.
PUBLIC_URL=https://iora.live
# Obtained from the Twitter Developer Portal.
TWITTER_BEARER_TOKEN=AAAA…
```

### Starting the server

_This section is only relevent to you if you’ve decided to run Iora on a platform other than Heroku._

```bash
git clone https://github.com/ifvictr/iora
cd iora
# Install dependencies
yarn
# Start Iora in production! This will build the source files and then run them.
yarn start
# Or, if you need to run it in development mode instead. This will start both the backend and frontend and run them concurrently.
yarn dev
```

After you’ve followed all the above steps, you should see something like this in the console:

```bash
Starting Iora…
Listening on port 3000
Connected to Twitter stream
```

## License

[MIT License](LICENSE.txt)
