const theme = {
  colors: {
    background: '#ffffff',
    text: '#14171a',
    white: '#ffffff',
    blue: '#1b95e0',
    green: '#17bf63',
    red: '#e0245e'
  },
  fonts: {
    body: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif`,
    heading: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif`
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontSize: '15px',
      lineHeight: 1.3125
    },
    a: {
      color: 'blue',
      textDecorationLine: 'none',
      ':hover': {
        textDecorationLine: 'underline'
      }
    }
  }
}

export default theme
