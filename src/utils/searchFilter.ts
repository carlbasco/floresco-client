const searchFilter = (data: Array<any>, keyword: string) => {
  const result = data.filter((value: any) => {
    return Object.keys(value).some((key) => {
      if (typeof value[key] === 'object') {
        const x = Object.values(value[key])
        return x.toString().toLowerCase().includes(keyword.toLowerCase())
      }
      return (
        value[key].toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1
      )
    })
  })
  return result
}

export default searchFilter
