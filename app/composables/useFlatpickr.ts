import "flatpickr/dist/flatpickr.css";
import { Japanese } from "flatpickr/dist/l10n/ja.js";
import 'floating-vue/dist/style.css';
import dayjs from "dayjs";

export const useFlatpickr = () => {
  const configDate = {
    wrap: true,
    allowInput: true,
    dateFormat: "Y-m-d",
    locale: Japanese,
    onDayCreate: onDayCreateFlatpickr,
  }
  const configRangeDate = {
    wrap: true,
    allowInput: true,
    dateFormat: "Y-m-d",
    locale: Japanese,
    mode: 'range',
    onDayCreate: onDayCreateFlatpickr,
  }
  const holidays = useState<any>('holidays')

  function onDayCreateFlatpickr(selectedDates: any, dateStr: any, instance: any, data: any)
  {
    const day = dayjs(data.dateObj)
    const ymd: string = day.format('YYYY-MM-DD')
    if (ymd in holidays.value) {
      // dataにセットしてmouseover/leaveのイベント追加
      data.classList.add('_flatpickr_holiday')
      data.dataset.holiday = holidays.value[ymd]
      data.addEventListener('mouseenter', mouseEnterEventFlatpickr)
      data.addEventListener('mouseleave', mouseLeaveEventFlatpickr)
      data.addEventListener('click', mouseLeaveEventFlatpickr)
    }
  }
  const mouseEnterEventFlatpickr = (e: MouseEvent) => {
    const t = e.target as HTMLElement
    const element = document.createElement('div')
    element.classList.add('_holiday_modal')
    element.innerHTML =`
      <div>${t.dataset.holiday}</div>
      `
    document.body.appendChild(element)
    window.addEventListener('mousemove', (e: MouseEvent) => {
      const x = e.clientX + 20
      const y = e.clientY
      element.style.left = x + 'px'
      element.style.top = y + 'px'
    })
  }

  const mouseLeaveEventFlatpickr = (e: MouseEvent) => {
    const element = document.querySelector('._holiday_modal') as HTMLElement
    element.remove()
  }

  return { configDate, configRangeDate }
}
