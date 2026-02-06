export const useIsAfterTomorrow = (date: Date): boolean => {
  const now = new Date()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDate = now.getDate()

  const now2 = new Date(nowYear, nowMonth , nowDate + 1, 0, 0, 0)

  return date >= now2
}
