import React, { useState } from 'react'
import { Slide } from 'react-reveal'
import { Box, Heading } from 'theme-ui'
import { useSocket } from 'use-socketio'
import Event from './Event'

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

const MAX_SAVED_TWEETS = 500

const EventList = () => {
  const [isConnected, setConnected] = useState(false)
  const [tweets, setTweets] = useState<Tweet[]>([])

  useSocket('connect', () => {
    setConnected(true)
  })
  useSocket('connect_error', () => {
    setConnected(false)
  })
  useSocket('tweet', data => {
    const newTweet = JSON.parse(data) as Tweet
    let newTweets = [newTweet, ...tweets]

    // Don't let saved tweet events grow over the max
    if (newTweets.length > MAX_SAVED_TWEETS) {
      newTweets = newTweets.slice(0, MAX_SAVED_TWEETS)
    }

    setTweets(newTweets)
  })

  return (
    <Box
      sx={{
        bg: 'white',
        boxShadow:
          'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        height: '24rem',
        overflowY: 'hidden',
        position: 'relative',
        transition: 'ease 25s height',
        width: '32rem',
        ':after': {
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0), white)',
          bottom: 0,
          content: '""',
          display: 'block',
          height: '6rem',
          left: 0,
          pointerEvents: 'none',
          position: 'absolute',
          transition: 'background 0.5s ease, opacity 0.5s ease',
          right: 0,
          ...(!isConnected && {
            background: 'white',
            height: '100%',
            opacity: 0.5
          })
        }
      }}
    >
      <Heading
        as="h2"
        py="10px"
        px="15px"
        sx={{
          bg: 'white',
          borderBottom: '1px solid #e6ecf0',
          fontSize: '19px',
          position: 'relative',
          zIndex: 1
        }}
      >
        Live from Twitter
      </Heading>
      {tweets.length !== 0 && (
        <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
          {tweets.map(tweet => {
            const sender = tweet.includes.users[0]
            return (
              <Slide top duration={500} key={tweet.data.id}>
                <Event
                  name={sender.name}
                  username={sender.username}
                  profileImage={sender.profile_image_url}
                  text={tweet.data.text}
                  isReply={!!tweet.data.in_reply_to_user_id}
                  isRetweet={tweet.data.text.startsWith('RT')}
                  key={tweet.data.id}
                />
              </Slide>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default EventList
