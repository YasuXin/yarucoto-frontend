export const useCreateWeekday = (d: Date): string => {
  const day = d.getDay()

  let weekDay = '';
  switch(day) {
    case 0:
      weekDay = '日'
      break;
    case 1:
      weekDay = '月'
      break;
    case 2:
      weekDay = '火'
      break;
    case 3:
      weekDay = '水'
      break;
    case 4:
      weekDay = '木'
      break;
    case 5:
      weekDay = '金'
      break;
    case 6:
      weekDay = '土'
      break;
    default:
      weekDay = 'error'
      break;
  }

  let weekdayText = ``
  if (weekDay === '日') {
    weekdayText = `(<span style="color: var(--f-red);">${weekDay}</span>)`
  } else if (weekDay === '土') {
    weekdayText = `(<span style="color: var(--f-blue);">${weekDay}</span>)`
  } else {
    weekdayText = `(<span>${weekDay}</span>)`
  }

  return weekdayText
}
