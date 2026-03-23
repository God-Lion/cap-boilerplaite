import React from 'react'
// Custom Typed Inputs
import { IMaskInput } from 'react-imask'

interface MaskProps {
  onChange?: (event: any) => void
  name?: string
}

const CINMask = React.forwardRef<HTMLInputElement, MaskProps>(function TextMaskCustom(props, ref) {
  const { onChange, name, ...other } = props
  return (
    <IMaskInput
      {...other}
      mask='00-00-00-00-00'
      definitions={{
        '#': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value: string) => onChange?.({ target: { name: name || '', value } })}
      overwrite
    />
  )
})

const BirthDateMask = React.forwardRef<HTMLInputElement, MaskProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, name, ...other } = props
    return (
      <IMaskInput
        {...other}
        mask='00-00-0000'
        definitions={{
          '#': /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value: string) => onChange?.({ target: { name: name || '', value } })}
        overwrite
      />
    )
  },
)

export { CINMask as cinInput, BirthDateMask as birthDateInput }
