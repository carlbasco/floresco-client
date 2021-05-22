import { forwardRef } from 'react'
import NumberFormat from 'react-number-format'

const PesoNumberFormat = forwardRef<NumberFormat, iProps>(
  function PesoNumberFormat(props, ref) {
    const { onChange, ...other } = props

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
        prefix="₱"
        isNumericString
        thousandSeparator
        allowNegative={false}
      />
    )
  }
)

interface iProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export const pesoFormat = (value:number) => {
  return '₱ '+value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export default PesoNumberFormat
