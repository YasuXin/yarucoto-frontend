const useMakeDateStrYearAndMonthAndDate = (year: number, month: number, date: number): string => {
  let monthStr = ''
  let dateStr = ''

  if (Number(month) < 10) {
    monthStr = '0' + month
  } else {
    monthStr = month + ''
  }

  if (Number(date) < 10) {
    dateStr = '0' + date
  } else {
    dateStr = date + ''
  }

  return year + '-' + monthStr + '-' + dateStr
}
