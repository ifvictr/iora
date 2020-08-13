interface Config {
  port: number
  isProduction: boolean
  bearerToken?: string
}

const config: Config = {
  port: parseInt(process.env.PORT || '') || 3000,
  isProduction: process.env.NODE_ENV === 'production',
  bearerToken: process.env.TWITTER_BEARER_TOKEN
}

export default config
