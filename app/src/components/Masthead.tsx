import React from 'react'
import { Container, Heading } from 'theme-ui'

const Masthead = () => (
  <Container>
    <Heading
      as="h1"
      sx={{
        background: '#ee9ca7',
        backgroundImage: 'linear-gradient(to right, #ee9ca7, #ffdde1)',
        fontSize: 64,
        fontWeight: 800
      }}
      css={{
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      iora
    </Heading>
    <Heading as="h3" pt={2}>
      Listen to music generated from new tweets on Twitter.
    </Heading>
  </Container>
)

export default Masthead
