import React from 'react'
import { Avatar, Box, Flex, Link, Text } from 'theme-ui'

type EventType = 'reply' | 'retweet' | 'tweet'

interface EventColorMap {
  [key: string]: string
}

const EVENT_COLORS: EventColorMap = {
  reply: '#1da0f2',
  retweet: 'green',
  tweet: 'transparent'
}

const getTypeColor = (type: EventType) => EVENT_COLORS[type] || 'transparent'

interface EventDescriptionMap {
  [key: string]: string
}

const EVENT_DESCRIPTIONS: EventDescriptionMap = {
  reply: 'replied to a tweet',
  retweet: 'retweeted',
  tweet: 'tweeted'
}

const getTypeDescription = (type: EventType) => EVENT_DESCRIPTIONS[type]

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
}: EventProps) => (
  <Box
    as="li"
    py={2}
    px={2}
    sx={{
      borderBottom: '1px solid #e6ecf0',
      borderLeft: '2px solid',
      borderLeftColor: getTypeColor(
        isReply ? 'reply' : isRetweet ? 'retweet' : 'tweet'
      )
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
          {getTypeDescription(
            isReply ? 'reply' : isRetweet ? 'retweet' : 'tweet'
          )}
        </Text>
        <Text color="#657786" mt={1}>
          {text}
        </Text>
      </Box>
    </Flex>
  </Box>
)

export default Event
