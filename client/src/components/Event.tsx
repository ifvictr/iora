import React from 'react'
import { Avatar, Box, Flex, Link, Text } from 'theme-ui'
import theme from '../theme'

export interface Media {
  media_key: string
  type: 'animated_gif' | 'photo' | 'video'
}

export interface Poll {
  id: string
}

export interface Tweet {
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
    referenced_tweets?: TweetReference[]
    text: string
  }
  includes: {
    media?: Media[]
    polls?: Poll[]
    tweets?: Tweet['data'][]
    users: User[]
  }
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

export const getEventType = (tweet: Tweet): EventType => {
  const RETWEET_PATTERN = /^RT @(.+):/g
  const isRetweet = RETWEET_PATTERN.test(tweet.data.text)

  if ('polls' in tweet.includes && !isRetweet) {
    return 'poll'
  } else if ('media' in tweet.includes && !isRetweet) {
    return 'media'
  } else if (!!tweet.data.in_reply_to_user_id) {
    return 'reply'
  } else if (isRetweet) {
    return 'retweet'
  }

  return 'tweet'
}

type EventType = 'media' | 'poll' | 'reply' | 'retweet' | 'tweet'

interface EventInfo {
  color: string
  description: (tweet: Tweet) => string | React.ReactElement
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
    description: tweet => {
      const recipient = tweet.includes.users.find(
        user => user.id === tweet.data.in_reply_to_user_id
      )
      return (
        <>
          replied to{' '}
          {!!recipient ? (
            <>
              <Link
                target="_blank"
                href={`https://twitter.com/${recipient.username}`}
                sx={{ color: 'black', fontWeight: 'bold' }}
              >
                {recipient.name}
              </Link>
            </>
          ) : (
            'a tweet'
          )}
        </>
      )
    }
  },
  retweet: {
    // There's probably a better way to do this
    color: theme.colors!.green as string,
    description: tweet => {
      const retweetReference = tweet.data.referenced_tweets!.find(
        referencedTweet => referencedTweet.type === 'retweeted'
      )
      const originalTweet = tweet.includes.tweets?.find(
        includedTweet => includedTweet.id === retweetReference?.id
      )
      const author = tweet.includes.users.find(
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
                sx={{ color: 'black', fontWeight: 'bold' }}
              >
                {author.name}
              </Link>
              ’s Tweet
            </>
          ) : (
            'a Tweet'
          )}
        </>
      )
    }
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
