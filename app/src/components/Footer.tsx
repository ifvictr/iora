import React from 'react'
import { Container, Link, Text } from 'theme-ui'

const Footer = () => (
  <Container py={4}>
    <Text>
      Made by{' '}
      <Link target="_blank" rel="noopener" href="https://victortruong.com">
        @ifvictr
      </Link>
      . The source code is available on{' '}
      <Link
        target="_blank"
        rel="author noopener"
        href="https://github.com/ifvictr/iora"
      >
        GitHub
      </Link>
      .
    </Text>
  </Container>
)

export default Footer
