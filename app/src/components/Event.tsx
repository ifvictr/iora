import React from 'react'
import { Avatar, Box, Flex, Link, Text } from 'theme-ui'
import theme from '../theme'

export interface Payload {
  data: Tweet
  includes: {
    media?: Media[]
    polls?: Poll[]
    tweets?: Tweet[]
    users: User[]
  }
  errors?: TwitterAPIError[]
}

export interface TwitterAPIError {
  detail: string
  parameter: string
  resource_type: string
  title: string
  type: string
  value: string
}

export interface Media {
  media_key: string
  type: 'animated_gif' | 'photo' | 'video'
}

export interface Poll {
  id: string
}

export interface Tweet {
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
  referenced_tweets?: TweetReference[]
  text: string
}

export interface TweetReference {
  id: string
  type: 'replied_to' | 'retweeted' | 'quoted'
}

export interface User {
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

const RETWEET_PATTERN = /^RT @(.+):\s/
export const getEventType = (payload: Payload): EventType => {
  const isRetweet = RETWEET_PATTERN.test(payload.data.text)

  if ('polls' in payload.includes && !isRetweet) {
    return 'poll'
  } else if ('media' in payload.includes && !isRetweet) {
    return 'media'
  } else if (!!payload.data.in_reply_to_user_id) {
    return 'reply'
  } else if (isRetweet) {
    return 'retweet'
  }

  return 'tweet'
}

export type EventType = 'media' | 'poll' | 'reply' | 'retweet' | 'tweet'

interface EventInfo {
  color: string
  description: (payload: Payload) => string | React.ReactElement
  transformText: (payload: Payload) => string
}

const EVENTS: Record<EventType, EventInfo> = {
  media: {
    color: 'transparent',
    description: payload => {
      const { type } = payload.includes.media![0]
      return `posted a ${type === 'animated_gif' ? 'GIF' : type}`
    },
    transformText: payload => payload.data.text
  },
  poll: {
    color: 'transparent',
    description: () => 'started a poll',
    transformText: payload => payload.data.text
  },
  reply: {
    color: 'transparent',
    description: payload => {
      const recipient = payload.includes.users.find(
        user => user.id === payload.data.in_reply_to_user_id
      )
      return (
        <>
          replied to{' '}
          {!!recipient ? (
            <>
              <Link
                target="_blank"
                href={`https://twitter.com/${recipient.username}`}
                sx={{ color: 'text', fontWeight: 'bold' }}
              >
                {recipient.name}
              </Link>
            </>
          ) : (
            'a tweet'
          )}
        </>
      )
    },
    transformText: payload => payload.data.text
  },
  retweet: {
    color: theme.colors.green,
    description: payload => {
      const retweetReference = payload.data.referenced_tweets!.find(
        referencedTweet => referencedTweet.type === 'retweeted'
      )
      const originalTweet = payload.includes.tweets?.find(
        includedTweet => includedTweet.id === retweetReference?.id
      )
      const author = payload.includes.users.find(
        user => user.id === originalTweet?.author_id
      )
      return (
        <>
          retweeted{' '}
          {!!author ? (
            <>
              <Link
                target="_blank"
                href={`https://twitter.com/${author.username}`}
                sx={{ color: 'text', fontWeight: 'bold' }}
              >
                {author.name}
              </Link>
              ’s tweet
            </>
          ) : (
            'a tweet'
          )}
        </>
      )
    },
    transformText: payload => payload.data.text.replace(RETWEET_PATTERN, '') // Remove the RT @user prefix
  },
  tweet: {
    color: '#1da0f2',
    description: () => 'tweeted',
    transformText: payload => payload.data.text
  }
}

interface EventProps {
  type: EventType
  data: Payload
}

const Event = ({ type, data: tweet }: EventProps) => {
  const { color, description, transformText } = EVENTS[type]
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
        boxShadow: `inset 2px 0 ${color}`
      }}
    >
      <Flex
        sx={{
          alignItems: 'stretch',
          flexDirection: 'row'
        }}
      >
        <Box ml="2px" sx={{ flexShrink: 0 }}>
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
              sx={{ color: 'text', fontWeight: 'bold' }}
            >
              {sender.name}
            </Link>{' '}
            {description(tweet)}
          </Text>
          <Text color="#657786" mt={1}>
            {transformText(tweet)}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default Event
