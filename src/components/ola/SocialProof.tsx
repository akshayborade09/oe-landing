'use client'

import { XStack, Text, View, styled } from 'tamagui'
import { Pill } from './Pill'

const DotIndicator = styled(View, {
  height: 6,
  width: 6,
  borderRadius: 3,
  backgroundColor: '$green10',
})

const DarkPill = styled(XStack, {
  paddingHorizontal: '$3',
  paddingVertical: '$1.5',
  borderRadius: 999,
  backgroundColor: 'rgba(24,24,27,0.7)',
  marginLeft: '$1',
})

export function SocialProof() {
  return (
    <XStack flexWrap="wrap" alignItems="center" gap="$2">
      <Pill>
        <XStack alignItems="center" gap="$2">
          <DotIndicator />
          <Text fontSize={12} color="$gray11">Popular choice</Text>
        </XStack>
      </Pill>
      <Pill>
        <XStack alignItems="center" gap="$2">
          <Text fontSize={12} color="$gray9">★</Text>
          <Text fontSize={12} color="$gray11">Rider-rated</Text>
        </XStack>
      </Pill>
      <Pill>
        <XStack alignItems="center" gap="$2">
          <Text fontSize={12} color="$gray9">⚡</Text>
          <Text fontSize={12} color="$gray11">Made for daily commutes</Text>
        </XStack>
      </Pill>
      <DarkPill>
        <Text fontSize={12} color="rgba(255,255,255,0.8)">
          Trusted by millions of rides
        </Text>
      </DarkPill>
    </XStack>
  )
}
