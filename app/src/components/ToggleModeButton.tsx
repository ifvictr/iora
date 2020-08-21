import React from 'react'
import { Button, SxStyleProp, useColorMode } from 'theme-ui'

export interface ToggleModeButtonProps {
  sx?: SxStyleProp
}

const ToggleModeButton = ({ sx, ...props }: ToggleModeButtonProps) => {
  const [colorMode, setColorMode] = useColorMode()

  return (
    <Button
      title={`Switch to ${colorMode === 'default' ? 'dark' : 'light'} mode`}
      onClick={() => {
        setColorMode(colorMode === 'default' ? 'dark' : 'default')
      }}
      sx={{
        bg: 'background',
        borderRadius: '9999px',
        boxShadow:
          colorMode === 'default'
            ? 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px'
            : 'rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px',
        outline: 'none',
        transition: 'background 0.5s ease, box-shadow 0.5s ease',
        ...sx
      }}
      {...props}
    >
      {colorMode === 'default' ? '🌚' : '🌞'}
    </Button>
  )
}

export default ToggleModeButton
