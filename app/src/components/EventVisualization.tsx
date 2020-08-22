import * as d3 from 'd3'
import React, { useRef } from 'react'
import { Box, useColorMode } from 'theme-ui'
import { useSocket } from 'use-socketio'
import { EVENTS, Payload, getEventType } from './Event'

interface SVGGroupProps {
  radius: number
  startingOpacity: number
  duration: number
  ringDuration: number
}

const getSVGGroupProps = (payload: Payload) => {
  const type = getEventType(payload)
  const values: SVGGroupProps = {
    radius: type === 'tweet' ? 30 : 15,
    startingOpacity: 1,
    duration: 10000,
    ringDuration: 5000
  }

  return values
}

const EventVisualization = () => {
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
      .attr('r', values.radius + 100)
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
        zIndex: -1,
        '& text': {
          fill: theme => theme.colors.text,
          transition: 'fill 0.5s ease'
        }
      }}
      ref={d3Ref}
    />
  )
}

export default EventVisualization
