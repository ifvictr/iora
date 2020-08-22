import * as d3 from 'd3'
import React, { useRef } from 'react'
import { Box, SxStyleProp, useColorMode } from 'theme-ui'
import { useSocket } from 'use-socketio'
import { EVENTS, Payload, User, getEventType } from './Event'

interface SVGGroupProps {
  radius: number
  duration: number
  ringRadius: number
  ringDuration: number
}

const getFollowerMultiplier = (followerCount: number) => {
  if (followerCount >= Math.pow(10, 7)) {
    // 10 million followers and above
    return 6
  } else if (followerCount >= Math.pow(10, 6)) {
    // Between 1 million followers and 9,999,999 followers
    return 4
  } else if (followerCount >= Math.pow(10, 5)) {
    // Between 100k and 999,999 followers
    return 2
  } else if (followerCount >= Math.pow(10, 4)) {
    // Between 10k and 99,999 followers
    return 1.25
  }

  return 1
}

const getSVGGroupProps = (payload: Payload) => {
  const type = getEventType(payload)
  const isNewTweet = type === 'tweet'
  const sender = payload.includes.users.find(
    user => user.id === payload.data.author_id
  ) as User
  const followerMultipler = getFollowerMultiplier(
    sender.public_metrics.followers_count
  )

  const values: SVGGroupProps = {
    radius: (isNewTweet ? 30 : 15) * followerMultipler,
    duration: isNewTweet ? 15000 : 7500,
    ringRadius: 75 * followerMultipler,
    ringDuration: isNewTweet ? 4000 : 2000
  }

  return values
}

interface EventVisualizationProps {
  sx?: SxStyleProp
}

const EventVisualization = ({ sx, ...props }: EventVisualizationProps) => {
  const d3Ref = useRef<HTMLDivElement>(null)
  const [colorMode] = useColorMode()

  useSocket('tweet', data => {
    if (!d3Ref.current) {
      return
    }

    const newPayload = JSON.parse(data) as Payload
    const type = getEventType(newPayload)
    const values = getSVGGroupProps(newPayload)

    const svg = d3.select(d3Ref.current)
    const container = svg.append('g')
    container
      .attr(
        'fill',
        EVENTS[type].color !== 'transparent' ? EVENTS[type].color : '#e6ecf0'
      )
      .attr(
        'transform',
        `translate(${Math.random() * window.innerWidth}, ${
          Math.random() * window.innerHeight
        })`
      )
      .transition()
      .delay(5000)
      .style('opacity', 0)
      .ease(Math.sqrt)
      .duration(values.ringDuration)
      .remove()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ring = container
      .append('circle')
      .attr('r', values.radius)
      .attr('stroke', 'none')
      .transition()
      .attr('r', values.ringRadius)
      .style('opacity', 0)
      .ease(Math.sqrt)
      .duration(values.ringDuration)
      .remove()

    const circle = container.append('circle')
    circle
      .attr('r', values.radius)
      .style('opacity', 0.5)
      .transition()
      .style('opacity', 0)
      .ease(Math.sqrt)
      .duration(values.duration)
      .remove()

    const link = container.append('a')
    link
      .attr(
        'href',
        `https://twitter.com/${newPayload.includes.users[0].username}/status/${newPayload.data.id}`
      )
      .attr('target', '_blank')
      .transition()
      .delay(2500)
      .style('opacity', 0)
      .ease(Math.sqrt)
      .duration(values.duration - 2500)
      .remove()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const description = link
      .append('text')
      .text(
        `${EVENTS[type].emoji} @${
          newPayload.includes.users[0].username
        } ${EVENTS[type].rawDescription(newPayload)}`
      )
      .attr('text-anchor', 'middle')
  })

  return (
    <Box
      as="svg"
      sx={{
        background:
          colorMode === 'default'
            ? 'radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px) 0% 0% / 24px 24px white'
            : 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px) 0% 0% / 24px 24px black',
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        transition: 'background 0.5s ease',
        width: '100%',
        '& text': {
          fill: theme => theme.colors.text,
          transition: 'fill 0.5s ease'
        },
        ...sx
      }}
      ref={d3Ref}
      {...props}
    />
  )
}

export default EventVisualization
