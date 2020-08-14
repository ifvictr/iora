import axios, { AxiosRequestConfig } from 'axios'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
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

app.use(helmet())
app.use(cors())
if (config.isProduction) {
  app.use(express.static(path.join(__dirname, '../../client/build')))
}

// Start receiving requests
server.listen(config.port, async () => {
  await getTweetSamples()
})
console.log(`Listening on port ${config.port}`)

const EXPANSIONS = [
  'attachments.media_keys',
  'attachments.poll_ids',
  'author_id',
  'in_reply_to_user_id'
]
const TWEET_FIELDS = [
  'attachments',
  'created_at',
  'geo',
  'in_reply_to_user_id',
  'lang',
  'possibly_sensitive',
  'public_metrics'
]
const MEDIA_FIELDS = ['media_key', 'type']
const POLL_FIELDS = ['id']
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
      'media.fields': MEDIA_FIELDS.join(','),
      'poll.fields': POLL_FIELDS.join(','),
      'tweet.fields': TWEET_FIELDS.join(','),
      'user.fields': USER_FIELDS.join(',')
    },
    responseType: 'stream',
    timeout: 5 * 1000
  }
  try {
    const { data } = await axios.request(options)

    console.log('Connected to Twitter stream')
    data.on('data', forwardTweet)

    data.on('close', () => {
      console.log(
        'The connection to Twitter’s stream endpoint was closed. Retrying in 10 seconds…'
      )
      setTimeout(async () => {
        await getTweetSamples()
      }, 10 * 1000)
    })
  } catch (e) {
    // TODO: Implement proper linear and exponential backoff strategies according
    // to https://developer.twitter.com/en/docs/twitter-api/tweets/sampled-stream/integrate/handling-disconnections.
    console.log(
      'An error occurred while trying to connect to Twitter’s stream endpoint. Retrying in 10 seconds…'
    )
    setTimeout(async () => {
      await getTweetSamples()
    }, 10 * 1000)
  }
}

let receivedTweets = 0
const forwardTweet = (data: Buffer) => {
  try {
    const dataStr = data.toString()

    // Don't forward heartbeats
    if (dataStr === '\r\n') {
      console.log('Received heartbeat')
      return
    }

    receivedTweets++
    if (receivedTweets % 35 !== 0) {
      return
    }

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
