import { useRef } from 'react'
import * as tone from 'tone'
import { useSocket } from 'use-socketio'
import { EventType, Payload, getEventType } from './Event'

const NOTES: Record<EventType, tone.Unit.Frequency> = {
  media: 'E4',
  poll: 'D4',
  reply: 'C4',
  retweet: 'B4',
  tweet: 'A4'
}

const MusicGenerator = () => {
  const synthRef = useRef(new tone.Synth().toDestination())

  useSocket('tweet', data => {
    const newPayload = JSON.parse(data) as Payload
    const type = getEventType(newPayload)

    synthRef.current.triggerAttackRelease(NOTES[type], '8n')
  })

  return null
}

export default MusicGenerator
