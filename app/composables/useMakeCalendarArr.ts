export const useMakeCalendarArr = (year: number, month: number): any[] => {
  const firstDay = new Date(Number(year), Number(month) - 1, 1, 0, 0)
  const lastDay = new Date(Number(year), Number(month) - 1, 1, 0, 0)
  lastDay.setMonth(lastDay.getMonth() + 1, 0)

  let arr = []

  for (let i = 0; i < firstDay.getDay(); i++) {
    arr.push(0)
  }

  for (let i = 0; i < lastDay.getDate(); i++) {
    arr.push(i+1)
  }

  let result: any[] = []
  for (let i = 0; i < 6; i++) {
    let innerArr: any[] = []
    for (let j = 0; j < 7; j++) {
      if (arr[j + i * 7] === undefined) {
        if (j === 0) {
          break
        }
        innerArr.push(0)
        continue
      }
      innerArr.push(arr[j + i * 7])

    }
    if (innerArr.length === 0) {
      break
    }
    result.push(innerArr)
  }

  return result
}
