export const useGetTodayStr = (): string => {
  let nowMonth = ''
  let nowDate = ''
  const now = new Date()
  if (now.getMonth() + 1 < 10) {
    nowMonth = '0' + (now.getMonth() + 1)
  } else {
    nowMonth = (now.getMonth() + 1) + ''
  }
  if (now.getDate() < 10) {
    nowDate = '0' + now.getDate()
  } else {
    nowDate = now.getDate() + ''
  }
  return  now.getFullYear() + '/' + nowMonth + '/' + nowDate
}
