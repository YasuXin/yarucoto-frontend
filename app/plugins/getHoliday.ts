export default async function() {
  const holidayUrl = 'https://holidays-jp.github.io/api/v1/date.json'
  const holidays = useState<Map<string, string> | null>('holidays', () => null)

  const getHoliday = async () => {
    try {
      const data = await $fetch(holidayUrl, {
        method: 'GET'
      }) as any
      holidays.value = data
    } catch (error) {
      console.error(error)
    }
  }
  await getHoliday()
}
