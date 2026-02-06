export const useRemoveSession = () => {
  const user = useState('user', () => null)
  const homeTasks = useState('homeTasks', () => null)
  const allTasks = useState('allTasks', () => null)
  const tags = useState('tags', () => null)
  const recurringTasks = useState('recurringTasks', () => null)
  const informationArr = useState('informationArr', () => null)
  const goalText = useState('goalText', () => null)
  const goalDescription = useState('goalDescription', () => null)
  user.value = null
  homeTasks.value = null
  allTasks.value = null
  tags.value = null
  recurringTasks.value = null
  informationArr.value = null
  goalText.value = null
  goalDescription.value = null
}
