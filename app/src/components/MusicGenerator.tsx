import { useEffect, useRef } from 'react'
import * as tone from 'tone'
import { useSocket } from 'use-socketio'
import { EventType, Payload, getEventType } from './Event'

const NOTES: Record<EventType, tone.Unit.Frequency> = {
  media: 'E3',
  poll: 'D3',
  reply: 'C3',
  retweet: 'B3',
  tweet: 'A3'
}

interface Beat {
  note: tone.Unit.Frequency
  duration: number
}

const CHARS_PER_THIRD = 93.333333
const getBeat = (payload: Payload): Beat => {
  // TODO: Get better notes/sequences with the variables in the payload
  const type = getEventType(payload)
  const tweetLength = payload.data.text.length
  return {
    note: NOTES[type],
    duration: Math.ceil(tweetLength / CHARS_PER_THIRD) // 1–3 seconds
  }
}

const MusicGenerator = () => {
  const synthRef = useRef(new tone.Synth().toDestination())
  const beatQueueRef = useRef<Beat[]>([])

  useEffect(() => {
    const playIntervalId = setInterval(() => {
      if (beatQueueRef.current.length === 0) {
        return
      }

      const nextBeat = beatQueueRef.current.shift() as Beat
      synthRef.current.triggerAttackRelease(nextBeat.note, nextBeat.duration)
    }, 500)

    return () => {
      clearInterval(playIntervalId)
    }
  }, [])

  useSocket('tweet', data => {
    const newPayload = JSON.parse(data) as Payload
    beatQueueRef.current.push(getBeat(newPayload))
  })

  return null
}

export default MusicGenerator
