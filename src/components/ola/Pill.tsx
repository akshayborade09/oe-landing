'use client'

import { ReactNode } from 'react'
import { XStack, Text, styled } from 'tamagui'

const PillContainer = styled(XStack, {
  alignItems: 'center',
  gap: '$2',
  borderRadius: 999,
  borderWidth: 1,
  borderColor: '$gray5',
  backgroundColor: 'rgba(255,255,255,0.8)',
  paddingHorizontal: '$3',
  paddingVertical: '$1.5',
})

const PillText = styled(Text, {
  fontSize: 12,
  color: '$gray11',
})

export function Pill({ children }: { children: ReactNode }) {
  return (
    <PillContainer>
      <PillText>{children}</PillText>
    </PillContainer>
  )
}
