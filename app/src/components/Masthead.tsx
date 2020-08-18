import React from 'react'
import { Container, Heading } from 'theme-ui'

const Masthead = () => (
  <Container>
    <Heading
      as="h1"
      sx={{
        background: '#00d2ff',
        backgroundImage: 'linear-gradient(to right, #00d2ff, #3a7bd5);',
        fontSize: 64,
        fontWeight: 800,
        textTransform: 'lowercase'
      }}
      css={{
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      Songbird
    </Heading>
    <Heading as="h3" pt={2}>
      Listen to music generated by new tweets on Twitter.
    </Heading>
  </Container>
)

export default Masthead