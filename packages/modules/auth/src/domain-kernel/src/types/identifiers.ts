export type UserId = string & { readonly _brand: 'UserId' }
export type TenantId = string & { readonly _brand: 'TenantId' }
export type SessionId = string & { readonly _brand: 'SessionId' }
export type OrganizationId = string & { readonly _brand: 'OrganizationId' }
export type RoleId = string & { readonly _brand: 'RoleId' }
export type PermissionId = string & { readonly _brand: 'PermissionId' }

export type ModuleId = `@idaas/${string}` | `@cap/${string}`

export function createUserId(value: string): UserId {
  return value as UserId
}

export function createTenantId(value: string): TenantId {
  return value as TenantId
}

export function createSessionId(value: string): SessionId {
  return value as SessionId
}

export function createOrganizationId(value: string): OrganizationId {
  return value as OrganizationId
}

export function createRoleId(value: string): RoleId {
  return value as RoleId
}

export function createPermissionId(value: string): PermissionId {
  return value as PermissionId
}
