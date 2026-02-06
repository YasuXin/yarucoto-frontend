export const useIsToday = (date: Date): boolean => {
  let now = new Date()
  let nowYear = now.getFullYear()
  let nowMonth = now.getMonth()
  let nowDate = now.getDate()

  let now2 = new Date(nowYear, nowMonth, nowDate, 0, 0, 0)

  let now3 = new Date(nowYear, nowMonth , nowDate + 1, 0, 0, 0)

  return date >= now2 && date < now3
}
