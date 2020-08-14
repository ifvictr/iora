import React from 'react'
import { Container, Link, Text } from 'theme-ui'

const Footer = () => (
  <Container py={4}>
    <Text sx={{ textAlign: 'center' }}>
      Made by{' '}
      <Link target="_blank" rel="noopener" href="https://victortruong.com">
        @ifvictr
      </Link>
      . Check out the source code on{' '}
      <Link
        target="_blank"
        rel="noopener"
        href="https://github.com/ifvictr/songbird"
      >
        GitHub
      </Link>
      !
    </Text>
  </Container>
)

export default Footer
