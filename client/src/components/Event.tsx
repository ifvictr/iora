import React from 'react'
import { Avatar, Box, Flex, Link, Text } from 'theme-ui'

type EventType = 'reply' | 'retweet' | 'tweet'

interface EventInfo {
  color: string
  description: string
}

const EVENTS: Record<EventType, EventInfo> = {
  reply: {
    color: '#1da0f2',
    description: 'replied to a tweet'
  },
  retweet: {
    color: 'green',
    description: 'retweeted'
  },
  tweet: {
    color: 'transparent',
    description: 'tweeted'
  }
}

interface EventProps {
  name: string
  username: string
  profileImage: string
  text: string
  isReply?: boolean
  isRetweet?: boolean
}

const Event = ({
  isReply = false,
  isRetweet = false,
  name,
  profileImage,
  text,
  username
}: EventProps) => {
  const type = isReply ? 'reply' : isRetweet ? 'retweet' : 'tweet'
  const { color, description } = EVENTS[type]
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
            src={profileImage}
            alt={`@${username}’s profile image`}
            height={24}
            width={24}
            sx={{ float: 'left' }} // Prevent alt text from overflowing
          />
        </Box>
        <Box ml={2}>
          <Text sx={{ overflowWrap: 'break-word' }}>
            <Link
              target="_blank"
              href={`https://twitter.com/${username}`}
              sx={{ color: 'black', fontWeight: 'bold' }}
            >
              {name}
            </Link>{' '}
            {description}
          </Text>
          <Text color="#657786" mt={1}>
            {text}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default Event
