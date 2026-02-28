export default interface IProfile {
  id: number
  userId: number
  avatarAssetId?: number | null
  name?: string | null
  biography?: string | null
  location?: string | null
  website?: string | null
  websiteUrl?: string
  company?: string | null
  twitterUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
  youtubeUrl?: string | null
  githubUrl?: string | null
  threadsUrl?: string | null
  emailOnComment?: boolean
  emailOnCommentReply?: boolean
  emailOnAchievement?: boolean
  emailOnNewDeviceLogin?: boolean
  emailOnWatchlist?: boolean
  emailOnMention?: boolean
  createdAt?: string
  updatedAt?: string
}
