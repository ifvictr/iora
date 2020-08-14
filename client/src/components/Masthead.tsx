import React from 'react'
import { Container, Heading } from 'theme-ui'

const Masthead = () => (
  <Container>
    <Heading as="h1">Songbird</Heading>
    <Heading as="h3" pt={2}>
      Listen to music generated by new tweets on Twitter.
    </Heading>
  </Container>
)

export default Masthead