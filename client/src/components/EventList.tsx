import React, { useState } from 'react'
import { Slide } from 'react-reveal'
import { Box, Heading } from 'theme-ui'
import { useSocket } from 'use-socketio'
import Event, { Payload, getEventType } from './Event'

const MAX_SAVED_PAYLOADS = 500

const EventList = () => {
  const [isConnected, setConnected] = useState(false)
  const [payloads, setPayloads] = useState<Payload[]>([])

  useSocket('connect', () => {
    setConnected(true)
  })
  useSocket('connect_error', () => {
    setConnected(false)
  })
  useSocket('tweet', data => {
    const newPayload = JSON.parse(data) as Payload
    let newPayloads = [newPayload, ...payloads]

    // Don't let the total saved payloads exceed the maximum
    if (newPayloads.length > MAX_SAVED_PAYLOADS) {
      newPayloads = newPayloads.slice(0, MAX_SAVED_PAYLOADS)
    }

    setPayloads(newPayloads)
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
        overflow: 'hidden',
        position: 'relative',
        width: '32rem',
        ':after': {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), white)',
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
