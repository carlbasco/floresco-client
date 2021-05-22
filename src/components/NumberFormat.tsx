import { forwardRef } from 'react'
import NumberFormat from 'react-number-format'

export const PhoneNumberFormat = forwardRef<NumberFormat, iProps>(
  function PesoNumberFormat(props, ref) {
    const { onChange, ...other } = props

    return (
      <NumberFormat
        {...other}
        format="+63 ### ### ####"
        placeholder="+63 ### ### ####"
        mask="_"
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
      />
    )
  }
)

export const CardNumberFormat = forwardRef<NumberFormat, iProps>(
  function CardNumberFormat(props, ref) {
    const { onChange, ...other } = props
    return (
      <NumberFormat
        {...other}
        format="#### #### #### #### ###"
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
      />
    )
  }
)

interface iProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}
