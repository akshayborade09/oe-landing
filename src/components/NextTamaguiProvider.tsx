'use client'

import { ReactNode } from 'react'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { TamaguiProvider } from 'tamagui'
import tamaguiConfig from '../../tamagui.config'

export const NextTamaguiProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      skipNextHead
      defaultTheme="light"
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProvider
        config={tamaguiConfig}
        disableRootThemeClass
        defaultTheme={theme}
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  )
}
