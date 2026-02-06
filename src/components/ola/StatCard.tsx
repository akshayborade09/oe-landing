'use client'

import { YStack, Text, styled } from 'tamagui'

const StatContainer = styled(YStack, {
  borderRadius: 24,
  borderWidth: 1,
  borderColor: '$gray5',
  backgroundColor: '$background',
  padding: '$5',
})

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <StatContainer>
      <Text fontSize={12} color="$gray10">
        {label}
      </Text>
      <Text
        fontSize={28}
        fontWeight="600"
        letterSpacing={-0.5}
        color="$gray12"
        marginTop="$2"
      >
        {value}
      </Text>
      {sub ? (
        <Text fontSize={12} color="$gray9" marginTop="$1">
          {sub}
        </Text>
      ) : null}
    </StatContainer>
  )
}
