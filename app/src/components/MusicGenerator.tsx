import React, { useEffect, useRef, useState } from 'react'
import { Flex, useColorMode } from 'theme-ui'
import * as tone from 'tone'
import { useSocket } from 'use-socketio'
import { EventType, Payload, getEventType } from './Event'

const NOTES: Record<EventType, tone.Unit.Frequency> = {
  media: 'Eb2',
  poll: 'Db2',
  reply: 'Cb2',
  retweet: 'Bb2',
  tweet: 'Ab2'
}

interface Beat {
  note: tone.Unit.Frequency
  duration: number
}

const CHARS_PER_FOURTH = 70
const getBeat = (payload: Payload): Beat => {
  // TODO: Get better notes/sequences with the variables in the payload
  const type = getEventType(payload)
  const tweetLength = payload.data.text.length
  return {
    note: NOTES[type],
    duration: Math.ceil(tweetLength / CHARS_PER_FOURTH)
  }
}

const MusicGenerator = () => {
  const synthRef = useRef(new tone.Synth().toDestination())
  const beatQueueRef = useRef<Beat[]>([])
  const [isReady, setReady] = useState(false)
  const [colorMode] = useColorMode()

  const checkForBeat = () => {
    if (!isReady) {
      return
    }

    if (beatQueueRef.current.length === 0) {
      setTimeout(checkForBeat, 1000) // Check for a new beat in one second
      return
    }

    const nextBeat = beatQueueRef.current.shift() as Beat
    synthRef.current.triggerAttackRelease(nextBeat.note, nextBeat.duration)

    // Check for another beat to play after this one's time is up
    setTimeout(checkForBeat, nextBeat.duration * 250)
  }

  // Get the user to click so we can start playing audio
  useEffect(() => {
    document.addEventListener(
      'click',
      async () => {
        setReady(true)
        await tone.start()
      },
      { once: true }
    )
  })

  // Start the check for beats to play on mount
  useEffect(checkForBeat)

  useSocket('tweet', data => {
    if (!isReady) {
      return
    }

    const newPayload = JSON.parse(data) as Payload
    beatQueueRef.current.push(getBeat(newPayload))
  })

  if (isReady) {
    return null
  }

  return (
    <Flex
      sx={{
        alignItems: 'center',
        background:
          colorMode === 'default'
            ? 'rgba(255, 255, 255, 0.75)'
            : 'rgba(0, 0, 0, 0.75)',
        cursor: 'pointer',
        fontWeight: 'bold',
        height: '100vh',
        justifyContent: 'center',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100vw'
      }}
    >
      Click anywhere to start the music.
    </Flex>
  )
}

export default MusicGenerator
