'use client'

import { ReactNode } from 'react'
import { YStack, Text, styled } from 'tamagui'

const CardContainer = styled(YStack, {
  borderRadius: 28,
  borderWidth: 1,
  borderColor: '$gray5',
  backgroundColor: '$background',
  padding: '$6',
})

export function ContentCard({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children?: ReactNode
}) {
  return (
    <CardContainer>
      <Text fontSize={14} fontWeight="600" color="$gray12">
        {title}
      </Text>
      {desc ? (
        <Text fontSize={14} color="$gray10" marginTop="$1">
          {desc}
        </Text>
      ) : null}
      {children ? <YStack marginTop="$5">{children}</YStack> : null}
    </CardContainer>
  )
}
