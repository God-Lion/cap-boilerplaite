import type { User, UserProfile, UserStatus } from '../types/user'
import type { Organization, OrganizationMember, OrganizationInvitation } from '../types/user'
import type { UserId, OrganizationId, TenantId } from '../types/identifiers'

export interface IUserRepository {
  findById(userId: UserId): Promise<User | null>

  findByEmail(email: string, tenantId?: TenantId): Promise<User | null>

  create(user: {
    email: string
    firstName: string
    lastName: string
    password?: string
    tenantId?: TenantId
  }): Promise<User>

  update(userId: UserId, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>

  updateStatus(userId: UserId, status: UserStatus): Promise<User>

  delete(userId: UserId): Promise<void>

  list(params?: {
    tenantId?: TenantId
    organizationId?: OrganizationId
    page?: number
    limit?: number
    search?: string
  }): Promise<{ users: User[]; total: number }>
}

export interface IUserProfileRepository {
  getProfile(userId: UserId): Promise<UserProfile | null>

  updateProfile(userId: UserId, data: Partial<UserProfile>): Promise<UserProfile>
}

export interface IOrganizationRepository {
  findById(organizationId: OrganizationId): Promise<Organization | null>

  findBySlug(slug: string): Promise<Organization | null>

  create(data: {
    name: string
    slug: string
    domain?: string
    tenantId?: TenantId
  }): Promise<Organization>

  update(organizationId: OrganizationId, data: Partial<Organization>): Promise<Organization>

  delete(organizationId: OrganizationId): Promise<void>

  list(params?: {
    tenantId?: TenantId
    page?: number
    limit?: number
  }): Promise<{ organizations: Organization[]; total: number }>
}

export interface IOrganizationMemberRepository {
  listMembers(organizationId: OrganizationId): Promise<OrganizationMember[]>

  addMember(
    organizationId: OrganizationId,
    userId: UserId,
    role: string,
  ): Promise<OrganizationMember>

  removeMember(organizationId: OrganizationId, userId: UserId): Promise<void>

  updateMemberRole(
    organizationId: OrganizationId,
    userId: UserId,
    role: string,
  ): Promise<OrganizationMember>
}

export interface IOrganizationInvitationRepository {
  listInvitations(organizationId: OrganizationId): Promise<OrganizationInvitation[]>

  createInvitation(
    organizationId: OrganizationId,
    data: {
      email: string
      role: string
      expiresAt: string
    },
  ): Promise<OrganizationInvitation>

  revokeInvitation(organizationId: OrganizationId, invitationId: string): Promise<void>

  acceptInvitation(token: string): Promise<{ userId: UserId; organizationId: OrganizationId }>
}
