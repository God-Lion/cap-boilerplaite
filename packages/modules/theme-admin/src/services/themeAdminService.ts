import { apiClient } from '@cap/platform-core';
import type { TenantThemeConfig } from '@cap/theme';
import type { ThemePresetId } from '@cap/theme';

export interface ThemeAdminServiceOptions {
  apiEndpoint?: string;
  organizationId?: string;
}

class ThemeAdminService {
  private apiEndpoint: string | undefined;
  private organizationId: string | undefined;

  constructor(options: ThemeAdminServiceOptions = {}) {
    this.apiEndpoint = options.apiEndpoint;
    this.organizationId = options.organizationId;
  }

  setEndpoint(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint;
  }

  setOrganizationId(organizationId: string) {
    this.organizationId = organizationId;
  }

  async fetchTheme(organizationId?: string): Promise<TenantThemeConfig | null> {
    const orgId = organizationId || this.organizationId;
    
    if (!this.apiEndpoint || !orgId) {
      return null;
    }

    try {
      const response = await apiClient.get<TenantThemeConfig>(`${this.apiEndpoint}/themes/${orgId}`);
      return response.data ?? null;
    } catch (error) {
      console.error('Error fetching theme:', error);
      throw error;
    }
  }

  async saveTheme(theme: TenantThemeConfig, organizationId?: string): Promise<TenantThemeConfig> {
    const orgId = organizationId || this.organizationId;
    
    if (!this.apiEndpoint || !orgId) {
      throw new Error('API endpoint or organization ID not configured');
    }

    try {
      const response = await apiClient.put<TenantThemeConfig>(`${this.apiEndpoint}/themes/${orgId}`, theme);
      if (!response.data) throw new Error('Failed to save theme');
      return response.data;
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  }

  async validateTheme(theme: Partial<TenantThemeConfig>): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!theme.organizationId) {
      errors.push('Organization ID is required');
    }

    if (theme.tokens?.colors) {
      for (const [key, token] of Object.entries(theme.tokens.colors)) {
        if (token && typeof token === 'object' && 'value' in token) {
          const value = token.value;
          if (
            !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) &&
            !/^rgba?\(/.test(value)
          ) {
            errors.push(`Invalid color value for ${key}: ${value}`);
          }
        }
      }
    }

    if (theme.effects?.neumorphism) {
      const { intensity, distance, altitude } = theme.effects.neumorphism;
      if (intensity !== undefined && (intensity < 0 || intensity > 1)) {
        errors.push('Neumorphism intensity must be between 0 and 1');
      }
      if (distance !== undefined && (distance < 0 || distance > 20)) {
        errors.push('Neumorphism distance must be between 0 and 20');
      }
      if (altitude !== undefined && (altitude < 0 || altitude > 45)) {
        errors.push('Neumorphism altitude must be between 0 and 45');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  async exportTheme(theme: TenantThemeConfig): Promise<string> {
    return JSON.stringify(theme, null, 2);
  }

  async importTheme(jsonString: string): Promise<TenantThemeConfig> {
    try {
      const parsed = JSON.parse(jsonString);
      
      const validation = await this.validateTheme(parsed);
      if (!validation.valid) {
        throw new Error(`Invalid theme: ${validation.errors.join(', ')}`);
      }

      return parsed as TenantThemeConfig;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  }
}

export const themeAdminService = new ThemeAdminService();

export default ThemeAdminService;
