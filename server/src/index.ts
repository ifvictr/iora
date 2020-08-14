import axios, { AxiosRequestConfig } from 'axios'
import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import socketIo from 'socket.io'
import config from './config'

interface User {
  id: string
  name: string
  profile_image_url: string
  public_metrics: {
    followers_count: number
    following_count: number
    listed_count: number
    tweet_count: number
  }
  username: string
  verified: boolean
}

interface Tweet {
  data: {
    author_id: string
    created_at: string
    id: string
    in_reply_to_user_id: string
    lang: string
    possibly_sensitive: boolean
    public_metrics: {
      like_count: number
      quote_count: number
      reply_count: number
      retweet_count: number
    }
    text: string
  }
  includes: {
    users: User[]
  }
}

// Start Express + Socket.IO server
console.log('Starting Songbird…')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(cors())
if (config.isProduction) {
  app.use(express.static(path.join(__dirname, '../../client/build')))
}

// Start receiving requests
server.listen(config.port, async () => {
  await getTweetSamples()
})
console.log(`Listening on port ${config.port}`)

const EXPANSIONS = ['author_id', 'in_reply_to_user_id']
const TWEET_FIELDS = [
  'created_at',
  'geo',
  'in_reply_to_user_id',
  'lang',
  'possibly_sensitive',
  'public_metrics'
]
const USER_FIELDS = [
  'name',
  'profile_image_url',
  'public_metrics',
  'username',
  'verified'
]

const getTweetSamples = async () => {
  const options: AxiosRequestConfig = {
    method: 'GET',
    baseURL: 'https://api.twitter.com/',
    url: '/2/tweets/sample/stream',
    headers: {
      Authorization: `Bearer ${config.bearerToken}`
    },
    params: {
      expansions: EXPANSIONS.join(','),
      'tweet.fields': TWEET_FIELDS.join(','),
      'user.fields': USER_FIELDS.join(',')
    },
    responseType: 'stream'
  }
  const { data } = await axios.request(options)
  data.on('data', forwardTweet)

  // TODO: Handle disconnections
}

let receivedTweets = 0
const forwardTweet = (data: Buffer) => {
  try {
    receivedTweets++
    if (receivedTweets % 35 !== 0) {
      return
    }
    const dataStr = data.toString()
    const tweet: Tweet = JSON.parse(dataStr)
    if (shouldTweetBeIgnored(tweet)) {
      return
    }

    io.volatile.json.emit('tweet', dataStr)
  } catch (e) {
    // Ignore tweets that couldn't be parsed
  }
}

const shouldTweetBeIgnored = (tweet: Tweet) => {
  return tweet.data.possibly_sensitive
}
