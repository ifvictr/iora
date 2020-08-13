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

const getTweetSamples = async () => {
  const options: AxiosRequestConfig = {
    method: 'GET',
    baseURL: 'https://api.twitter.com/',
    url: '/2/tweets/sample/stream',
    headers: {
      Authorization: `Bearer ${config.bearerToken}`
    },
    params: {
      expansions: 'author_id',
      'tweet.fields':
        'created_at,geo,in_reply_to_user_id,lang,possibly_sensitive',
      'user.fields': 'name,profile_image_url,username,verified'
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
    // Filter out sensitive tweets
    if (tweet.data.possibly_sensitive) {
      return
    }

    io.volatile.json.emit('tweet', dataStr)
  } catch (e) {
    // Ignore tweets that couldn't be parsed
  }
}
