'use client'

import { XStack, YStack, Text, View, styled } from 'tamagui'

const Avatar = styled(View, {
  height: 32,
  width: 32,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: '$background',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    variant: {
      light: {
        backgroundColor: '$gray3',
      },
      dark: {
        backgroundColor: '$gray12',
      },
    },
  } as const,
})

export function MiniAvatarRow() {
  const dots = ['A', 'S', 'R', 'K', 'M']
  return (
    <XStack alignItems="center" gap="$2">
      <XStack>
        {dots.map((d, i) => (
          <View key={d} marginLeft={i > 0 ? -8 : 0}>
            <Avatar variant={i % 2 === 0 ? 'light' : 'dark'}>
              <Text
                fontSize={12}
                fontWeight="600"
                color={i % 2 === 0 ? '$gray12' : '$background'}
              >
                {d}
              </Text>
            </Avatar>
          </View>
        ))}
      </XStack>
      <Text fontSize={12} color="$gray11">
        <Text fontWeight="600">4.6</Text> average rider satisfaction
      </Text>
    </XStack>
  )
}
