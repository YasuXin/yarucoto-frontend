export const useMakeDateStrFromDate = (date: Date): string => {

  const dateYear = date.getFullYear()

  let monthStr = ''
  if (date.getMonth() + 1 < 10) {
    monthStr = '0' + (date.getMonth() + 1)
  } else {
    monthStr = (date.getMonth() + 1) + ''
  }

  let dateStr = ''
  if (date.getDate() < 10) {
    dateStr = '0' + date.getDate()
  } else {
    dateStr = date.getDate() + ''
  }

  return dateYear + '-' + monthStr + '-' + dateStr
}
