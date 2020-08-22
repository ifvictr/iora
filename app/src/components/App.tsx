import React from 'react'
import { Container, ThemeProvider } from 'theme-ui'
import { SocketIOProvider } from 'use-socketio'
import theme from '../theme'
import EventList from './EventList'
import EventVisualization from './EventVisualization'
import Footer from './Footer'
import Masthead from './Masthead'
import MusicGenerator from './MusicGenerator'
import ToggleModeButton from './ToggleModeButton'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ToggleModeButton
        sx={{
          position: 'fixed',
          right: '20px',
          top: '20px'
        }}
      />
      <Container py={3} px={2} sx={{ maxWidth: '64rem' }}>
        <Masthead />
        <Footer />
      </Container>
      <SocketIOProvider url="/">
        <EventList
          sx={{
            borderBottomLeftRadius: [0, '15px'],
            borderBottomRightRadius: [0, '15px'],
            bottom: [0, '20px'],
            position: 'fixed',
            right: [0, '20px']
          }}
        />
        <EventVisualization sx={{ zIndex: -1 }} />
        <MusicGenerator />
      </SocketIOProvider>
    </ThemeProvider>
  )
}

export default App
