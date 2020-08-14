import React from 'react'
import { Box, Container, ThemeProvider } from 'theme-ui'
import { SocketIOProvider } from 'use-socketio'
import EventList from './components/EventList'
import Footer from './components/Footer'
import Masthead from './components/Masthead'
import theme from './theme'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SocketIOProvider url="/">
        <Container sx={{ maxWidth: '64rem' }}>
          <Masthead />
          <Box
            sx={{
              bottom: 0,
              position: 'fixed',
              right: '20px'
            }}
          >
            <EventList />
          </Box>
          <Footer />
        </Container>
      </SocketIOProvider>
    </ThemeProvider>
  )
}

export default App
