'use client'

import { YStack, XStack, Text, View, styled } from 'tamagui'

const BentoContainer = styled(YStack, {
  borderRadius: 26,
  borderWidth: 1,
  borderColor: '$gray5',
  backgroundColor: '$background',
  overflow: 'hidden',
})

const ImagePlaceholder = styled(View, {
  height: 144,
  backgroundColor: '$gray3',
  position: 'relative',
})

const Tag = styled(XStack, {
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.8)',
  borderWidth: 1,
  borderColor: '$gray5',
  position: 'absolute',
  bottom: 12,
  left: 12,
})

export function BentoItem({
  title,
  desc,
  tag,
}: {
  title: string
  desc: string
  tag: string
}) {
  return (
    <BentoContainer>
      <ImagePlaceholder>
        <Tag>
          <Text fontSize={11} color="$gray11">
            {tag}
          </Text>
        </Tag>
      </ImagePlaceholder>
      <YStack padding="$5">
        <Text fontSize={14} fontWeight="600" color="$gray12">
          {title}
        </Text>
        <Text fontSize={14} color="$gray10" marginTop="$1">
          {desc}
        </Text>
      </YStack>
    </BentoContainer>
  )
}
