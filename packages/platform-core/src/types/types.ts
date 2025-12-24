
import { IParticipant } from './IUser'

export interface ICategory {
  _id?: string
  id?: string
  name: string
  description?: string
  icon?: string
  color?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// Duplicate in app-types.ts
// export interface IUpdateNames {
//   firstname?: string
//   lastname?: string
// }

export interface IContestEdition {
  id: string
  name: string
  [key: string]: unknown
}

// Duplicate in app-types.ts
// export interface IFormContest {
//   lastname?: string
//   firstname?: string
//   email?: string
//   user_id?: number | string
//   [key: string]: unknown
// }

export interface IContest {
  _id: string
  title?: string
  name?: string
  description?: string
  categoryId?: string
  startDate?: string
  endDate?: string
  status?: 'draft' | 'active' | 'closed'
  rules?: string
  prizes?: string[]
  editions?: Array<IContestEdition>
  createdAt?: string
  updatedAt?: string
}

export interface IUser {
  _id?: string
  id?: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  role?: number | string
  avatar?: string
  [key: string]: unknown
}

export type IUserTypeWithAction = IUser & {
  action?: React.ReactNode
}

export type ITypeWithAction = IParticipant & {
  action?: React.ReactNode
  user?: IUser
}
