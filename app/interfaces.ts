export interface Task {
  id: number,
  title: string,
  description: string,
  completed: boolean,
  dueDate: string,
  dueStartTime: string,
  dueEndTime: string,
  tag1: Tag,
  tag2: Tag,
  tag3: Tag,
  isRecurring: boolean,
  recurringId: number | undefined,
  createdAt: string,
  updatedAt: string
}
export interface RecurringTask {
  id: number,
  title: string,
  description: string,
  dueStartTime: string,
  dueEndTime: string,
  isActive: boolean,
  isSunday: boolean,
  isMonday: boolean,
  isTuesday: boolean,
  isWednesday: boolean,
  isThursday: boolean,
  isFriday: boolean,
  isSaturday: boolean,
  tag1: Tag,
  tag2: Tag,
  tag3: Tag,
  createdAt: string,
  updatedAt: string
}
export interface Tag {
  id: number,
  name: string,
  color: number,
  description: string,
  createdAt: string,
  updatedAt: string
}
export interface User{
  id: number,
  username: string,
  nickname: string,
  email: string,
  role: string,
  postalCode: string,
  address: string,
  phoneNumber: string,
  trial: boolean,
  remainTrial: number,
  createdAt: string,
  updatedAt: string
}
export interface Goal {
  id: number,
  title: string,
  description: string,
  year: number,
  month: number,
  createdAt: string,
  updatedAt: string
}
export interface Evaluation {
  id: number,
  rate: number,
  text: string,
  year: number,
  month: number,
  createdAt: string,
  updatedAt: string
}
export interface Information {
  id: number,
  editor: string,
  title: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  newInformation: boolean
}
export interface Inquiry {
  id: number,
  name: string,
  email: string,
  postalCode: string,
  address: string,
  phoneNumber: string,
  text: string,
  createdAt: string,
  updatedAt: string
}

export interface AdminUser{
  id: number,
  username: string,
  nickname: string,
  email: string,
  roleId: number,
  postalCode: string,
  address: string,
  phoneNumber: string,
  createdAt: string,
  updatedAt: string
}
export interface AdminTask {
  id: number,
  title: string,
  description: string,
  completed: boolean,
  dueDate: string,
  dueStartTime: string,
  dueEndTime: string,
  tag1: Tag,
  tag2: Tag,
  tag3: Tag,
  isRecurring: boolean,
  recurringId: number | undefined,
  createdAt: string,
  updatedAt: string
}
export interface AdminRecurringTask {
  id: number,
  title: string,
  description: string,
  dueStartTime: string,
  dueEndTime: string,
  isActive: boolean,
  isSunday: boolean,
  isMonday: boolean,
  isTuesday: boolean,
  isWednesday: boolean,
  isThursday: boolean,
  isFriday: boolean,
  isSaturday: boolean,
  tag1: Tag,
  tag2: Tag,
  tag3: Tag,
  createdAt: string,
  updatedAt: string
}
export interface AdminTag {
  id: number,
  name: string,
  color: number,
  description: string,
  createdAt: string,
  updatedAt: string
}
export interface AdminGoal {
  id: number,
  title: string,
  description: string,
  year: number,
  month: number,
  createdAt: string,
  updatedAt: string
}
export interface AdminEvaluation {
  id: number,
  rate: number,
  text: string,
  year: number,
  month: number,
  createdAt: string,
  updatedAt: string
}
export interface AdminInquiry {
  id: number,
  userId: number,
  name: string,
  email: string,
  postalCode: string,
  address: string,
  phoneNumber: string,
  text: string,
  createdAt: string,
  updatedAt: string
}
