'use client'

import { XStack, Button, styled } from 'tamagui'

const SegmentedContainer = styled(XStack, {
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$gray5',
  backgroundColor: '$background',
  padding: '$1',
})

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { label: string; value: T }[]
  onChange: (v: T) => void
}) {
  return (
    <SegmentedContainer>
      {options.map((o) => {
        const active = o.value === value
        return (
          <Button
            key={o.value}
            onPress={() => onChange(o.value)}
            size="$3"
            borderRadius={12}
            backgroundColor={active ? '$gray12' : 'transparent'}
            color={active ? '$background' : '$gray11'}
            fontWeight="500"
            fontSize={13}
            pressStyle={{
              backgroundColor: active ? '$gray12' : '$gray3',
            }}
            hoverStyle={{
              backgroundColor: active ? '$gray12' : '$gray3',
            }}
            borderWidth={0}
          >
            {o.label}
          </Button>
        )
      })}
    </SegmentedContainer>
  )
}
