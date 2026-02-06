export const useMakeStrFromTimestamp = (timestamp: string) => {
  const dateTime = new Date(timestamp)
  const date = dateTime.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'})
  const time = dateTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  if (date === 'Invalid Date' || time === 'Invalid Date') return ('-')
  return date + '　' + time
}
