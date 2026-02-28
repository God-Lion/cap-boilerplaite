export interface UserDto {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roleId: number;
  avatarUrl?: string;
}

export interface LoginResponseDto {
  user: UserDto;
  token: string; // Access Token
  expires_in?: number;
}

export interface RefreshResponseDto {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface TokenInternalData {
  accessToken: string;
  expiresAt: number;
}
