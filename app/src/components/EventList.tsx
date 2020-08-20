import React, { useEffect, useRef, useState } from 'react'
import { Slide } from 'react-reveal'
import { Box, Heading, SxStyleProp } from 'theme-ui'
import { useSocket } from 'use-socketio'
import Event, { Payload, getEventType } from './Event'

const MAX_SAVED_PAYLOADS = 500

export interface EventListProps {
  sx?: SxStyleProp
}

const EventList = ({ sx, ...props }: EventListProps) => {
  const [isConnected, setConnected] = useState(false)
  const [payloads, setPayloads] = useState<Payload[]>([])
  const payloadQueueRef = useRef<Payload[]>([])

  useEffect(() => {
    const addIntervalId = setInterval(() => {
      if (payloadQueueRef.current.length === 0) {
        return
      }

      const nextPayload = payloadQueueRef.current.shift() as Payload
      // Don't let the total saved payloads exceed the maximum
      setPayloads([nextPayload, ...payloads].slice(0, MAX_SAVED_PAYLOADS))
    }, 500)

    return () => {
      clearInterval(addIntervalId)
    }
  }, [payloads])

  useSocket('connect', () => {
    setConnected(true)
  })
  useSocket('connect_error', () => {
    setConnected(false)
  })
  useSocket('stream_close', () => {
    setConnected(false)
  })

  useSocket('tweet', data => {
    // Fix visual indicator when `connect` occasionally fails to fire
    if (!isConnected) {
      setConnected(true)
    }

    const newPayload = JSON.parse(data) as Payload
    // Adhere to the payload queue's cap
    if (payloadQueueRef.current.length < MAX_SAVED_PAYLOADS) {
      payloadQueueRef.current.push(newPayload)
    }
  })

  return (
    <Box
      sx={{
        bg: 'background',
        boxShadow:
          'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
        borderRadius: '15px',
        height: '12rem',
        overflow: 'hidden',
        position: 'relative',
        width: '32rem',
        ':after': {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), white)',
          bottom: 0,
          content: '""',
          display: 'block',
          height: '4rem',
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
        },
        ...sx
      }}
      {...props}
    >
      <Box
        py="10px"
        px="15px"
        sx={{
          borderBottom: '1px solid #e6ecf0',
          position: 'relative'
        }}
      >
        <Heading as="h2" sx={{ fontSize: '19px' }}>
          Live from Twitter
        </Heading>
      </Box>
      {payloads.length !== 0 && (
        <Box
          as="ol"
          sx={{ height: '100%', listStyle: 'none', overflowY: 'auto', pl: 0 }}
        >
          {payloads.map(payload => (
            <Slide top duration={500} key={payload.data.id}>
              <Event type={getEventType(payload)} data={payload} />
            </Slide>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default EventList
