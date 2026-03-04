import { IUserResponse, ILogin } from './IAuth'

export enum Roles {
  USER = 1,
  PARTICIPANT = 2,
  JUDGE = 3,
  PROVIDEREMPLOYEE = 4,
  PROVIDERADMIN = 5,
  ADMIN = 6,
  SUPERADMINEMPLOYEE = 7,
  SUPERADMIN = 8,
}

export const RoleWeights = [
  Roles.USER,
  Roles.PARTICIPANT,
  Roles.JUDGE,
  Roles.PROVIDEREMPLOYEE,
  Roles.PROVIDERADMIN,
  Roles.ADMIN,
  Roles.SUPERADMINEMPLOYEE,
  Roles.SUPERADMIN,
]
export interface IGlobalState {
  user: IUserResponse | null
  contests: unknown[]
  editions: unknown[]
  current_contest_id: number
  current_edition_id: number
  setCurrentContestId: (id: number) => void
  setCurrentEditionId: (id: number) => void
  error: unknown
  loading: boolean
  messageAlert: unknown
  signin: (data: ILogin) => Promise<void>
  signOut: () => void
  set: (data: Partial<IGlobalState>) => void
}

export interface ITab {
  key: string
  label: string
  icon?: React.JSX.Element
  component: React.JSX.Element
}

export interface ISubMenu {
  name: string
  icon: React.JSX.Element
  link: string
}

export interface IMenu {
  name: string
  icon: React.JSX.Element
  link: string
  menu?: Array<ISubMenu>
}

export interface IStatus {
  open: boolean
  type: string
  state: string
  msg: string
}

export interface ICustomizedLabel {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  name: string
  index: number
}

export interface IDepartment {
  code: string
  codePostal: string
  department: string
  arrondissement: Array<IArrondissement>
}
export interface IArrondissement {
  codeDep: string
  code: string
  codePostal: string
  arrondissement: string
  commune: Array<ICommune>
}
export interface ICommune {
  codePostal: string
  commune: string
  localite?: Array<string>
}

export interface Member {
  id?: number
  email: string
}
export interface ISongData {
  result: string | ArrayBuffer | null | undefined
  file: File
}

export type ISubscriberPersonalInfo = {
  category_id?: number
  holderLastname?: string
  holderFirstname?: string
  relationship?: string
  lastname?: string
  firstname?: string
  email?: string
  sexe?: string
  dateBirth?: any
  country?: string
  communeBirth?: string
  address?: string
  phone?: string
}

export type IFormDrawingContest = ISubscriberPersonalInfo & {
  user_id?: number | string
  participationType?: string
  groupMember?: string
  whatsapp?: string
  instagram?: string
  twitter?: string
  facebook?: string
  presentation?: string
  subject?: string
  drawing?: string
  imageDrawing?: {
    result: string | ArrayBuffer | undefined
    file: File
  }
  presentationDrawing?: string
  terms?: boolean
}
export type IMusicSubscribe = ISubscriberPersonalInfo & {
  id?: number
  edition_id?: number
  user_id?: number | string
  isInGroup?: boolean
  group_name?: string
  number_group_member?: number
  member?: Array<Member>
  songTitle?: string
  songArtistName?: string
  songGenre?: string
  songImageCover?: File
  songImageCoverData?: {
    result: string | ArrayBuffer | undefined
    file: File
  }
  song?: File
  songData?: ISongData
  terms?: boolean
}

export interface IUpdateNames {
  lastName?: string
  firstName?: string
}

export type IFormContest = IFormDrawingContest & IMusicSubscribe
