export const useGetTagColor = (num: number): string => {
  if (num === 1) {
    return '_c_default'
  } else if (num === 2) {
    return '_c_red'
  } else if (num === 3) {
    return '_c_orange'
  } else if (num === 4) {
    return '_c_yellow'
  } else if (num === 5) {
    return '_c_green'
  } else if (num === 6) {
    return '_c_blue'
  } else if (num === 7) {
    return '_c_indigo'
  } else if (num === 8) {
    return '_c_purple'
  } else {
    return '_c_default'
  }
}
