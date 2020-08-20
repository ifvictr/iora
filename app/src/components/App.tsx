import React from 'react'
import { Container, ThemeProvider } from 'theme-ui'
import { SocketIOProvider } from 'use-socketio'
import theme from '../theme'
import EventList from './EventList'
import EventVisualization from './EventVisualization'
import Footer from './Footer'
import Masthead from './Masthead'
import MusicGenerator from './MusicGenerator'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container py={3} px={2} sx={{ maxWidth: '64rem' }}>
        <Masthead />
        <SocketIOProvider url="/">
          <EventVisualization />
          <EventList
            sx={{ bottom: '20px', position: 'fixed', right: '20px' }}
          />
          <MusicGenerator />
        </SocketIOProvider>
        <Footer />
      </Container>
    </ThemeProvider>
  )
}

export default App
