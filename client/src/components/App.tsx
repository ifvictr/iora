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
