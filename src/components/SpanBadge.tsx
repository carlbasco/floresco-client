import useStyles from '@styles/components/spanBadge'

const SpanBadge = (props: iProps) => {
  const classes = useStyles()
  const { variant, label } = props
  let style
  variant === 'success'
    ? (style = classes.success)
    : variant === 'warning'
    ? (style = classes.warning)
    : variant === 'error'
    ? (style = classes.error)
    : (style = classes.info)
  return (
    <>
      <span className={style}>{label}</span>
    </>
  )
}

interface iProps {
  variant: 'success' | 'warning' | 'error' | 'info'
  label: string
}

export default SpanBadge
