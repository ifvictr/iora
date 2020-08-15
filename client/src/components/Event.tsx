import React from 'react'
import { Avatar, Box, Flex, Link, Text } from 'theme-ui'
import { Tweet, User } from './EventList'

type EventType = 'media' | 'poll' | 'reply' | 'retweet' | 'tweet'

interface EventInfo {
  color: string
  description: (tweet: Tweet) => string
}

const EVENTS: Record<EventType, EventInfo> = {
  media: {
    color: 'transparent',
    description: tweet => {
      const { type } = tweet.includes.media![0]
      return `posted a ${type === 'animated_gif' ? 'GIF' : type}`
    }
  },
  poll: {
    color: 'transparent',
    description: () => 'started a poll'
  },
  reply: {
    color: '#1da0f2',
    description: () => 'replied to a tweet'
  },
  retweet: {
    color: 'green',
    description: () => 'retweeted'
  },
  tweet: {
    color: 'transparent',
    description: () => 'tweeted'
  }
}

interface EventProps {
  type: EventType
  data: Tweet
}

const Event = ({ type, data: tweet }: EventProps) => {
  const { color, description } = EVENTS[type]
  const sender = tweet.includes.users.find(
    user => user.id === tweet.data.author_id
  ) as User
  return (
    <Box
      as="li"
      py={2}
      px={2}
      sx={{
        borderBottom: '1px solid #e6ecf0',
        borderLeft: '2px solid',
        borderLeftColor: color
      }}
    >
      <Flex
        sx={{
          alignItems: 'stretch',
          flexDirection: 'row'
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Avatar
            src={sender.profile_image_url}
            alt={`@${sender.username}’s profile image`}
            height={24}
            width={24}
            sx={{ float: 'left' }} // Prevent alt text from overflowing
          />
        </Box>
        <Box ml={2}>
          <Text sx={{ overflowWrap: 'break-word' }}>
            <Link
              target="_blank"
              href={`https://twitter.com/${sender.username}`}
              sx={{ color: 'black', fontWeight: 'bold' }}
            >
              {sender.name}
            </Link>{' '}
            {description(tweet)}
          </Text>
          <Text color="#657786" mt={1}>
            {tweet.data.text}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default Event
