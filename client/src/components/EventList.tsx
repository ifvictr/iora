import React, { useState } from 'react'
import { Slide } from 'react-reveal'
import { Box, Heading } from 'theme-ui'
import { useSocket } from 'use-socketio'
import Event, { Tweet, getEventType } from './Event'

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
        position: 'relative',
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
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          fontSize: '19px',
          position: 'relative',
          zIndex: 1
        }}
      >
        Live from Twitter
      </Heading>
      {tweets.length !== 0 && (
        <Box
          as="ol"
          sx={{ height: '100%', listStyle: 'none', overflowY: 'auto', pl: 0 }}
        >
          {tweets.map(tweet => (
            <Slide top duration={500} key={tweet.data.id}>
              <Event type={getEventType(tweet)} data={tweet} />
            </Slide>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default EventList
