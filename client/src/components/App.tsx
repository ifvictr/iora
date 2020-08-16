import React from 'react'
import { Box, Container, ThemeProvider } from 'theme-ui'
import { SocketIOProvider } from 'use-socketio'
import theme from '../theme'
import EventList from './EventList'
import Footer from './Footer'
import Masthead from './Masthead'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SocketIOProvider url="/">
        <Container py={3} px={2} sx={{ maxWidth: '64rem' }}>
          <Masthead />
          <EventList
            sx={{ bottom: '20px', position: 'fixed', right: '20px' }}
          />
          <Footer />
        </Container>
      </SocketIOProvider>
    </ThemeProvider>
  )
}

export default App
