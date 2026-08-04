import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Button,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { ColorPaletteEditor } from '../components/ColorPaletteEditor';
import { GlassmorphismPanel } from '../components/EffectControls/GlassmorphismPanel';
import { NeumorphismPanel } from '../components/EffectControls/NeumorphismPanel';
import { ComponentStyleSelector } from '../components/ComponentStyleSelector';
import { SpacingEditor } from '../components/SpacingEditor';
import { PresetSelector } from '../components/PresetSelector';
import { LivePreview } from '../components/LivePreview';
import type {
  TenantThemeConfig,
  ColorToken,
  GlassmorphismConfig,
  NeumorphismConfig,
  ComponentStyles,
  EffectType,
} from '@cap/theme';
import { DEFAULT_TENANT_THEME } from '@cap/theme';
import type { ThemePresetId } from '@cap/theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 16 }}>
    {value === index && <Box>{children}</Box>}
  </div>
);

interface ThemeEditorProps {
  initialTheme?: TenantThemeConfig;
  organizationId?: string;
  onSave?: (theme: TenantThemeConfig) => Promise<void>;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  initialTheme,
  organizationId = 'default',
  onSave,
}) => {
  const [theme, setTheme] = useState<TenantThemeConfig>(
    initialTheme || DEFAULT_TENANT_THEME
  );
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleColorsChange = useCallback((colors: Record<string, ColorToken>) => {
    setTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        colors: {
          ...prev.tokens.colors,
          ...colors,
        } as TenantThemeConfig['tokens']['colors'],
      },
    }));
  }, []);

  const handleGlassmorphismChange = useCallback((glassmorphism: GlassmorphismConfig) => {
    setTheme((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        glassmorphism,
        globalType: glassmorphism.enabled ? 'glass' : prev.effects.globalType,
      },
    }));
  }, []);

  const handleNeumorphismChange = useCallback((neumorphism: NeumorphismConfig) => {
    setTheme((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        neumorphism,
        globalType: neumorphism.enabled ? 'neu' : prev.effects.globalType,
      },
    }));
  }, []);

  const handleComponentsChange = useCallback((components: ComponentStyles) => {
    setTheme((prev) => ({
      ...prev,
      components,
    }));
  }, []);

  const handleGlobalEffectChange = useCallback((globalType: EffectType) => {
    setTheme((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        globalType,
      },
    }));
  }, []);

  const handleSpacingChange = useCallback((spacing: Record<string, string>) => {
    setTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        spacing,
      },
    }));
  }, []);

  const handleBorderRadiusChange = useCallback((borderRadius: Record<string, string>) => {
    setTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        borderRadius,
      },
    }));
  }, []);

  const handlePresetSelect = useCallback((presetId: ThemePresetId) => {
    const presets: Record<ThemePresetId, TenantThemeConfig> = {
      default: { ...DEFAULT_TENANT_THEME, organizationId },
      glassmorphism: {
        ...DEFAULT_TENANT_THEME,
        organizationId,
        preset: 'glassmorphism',
        effects: {
          ...DEFAULT_TENANT_THEME.effects,
          globalType: 'glass',
          glassmorphism: { ...DEFAULT_TENANT_THEME.effects.glassmorphism, enabled: true },
        },
        tokens: {
          ...DEFAULT_TENANT_THEME.tokens,
          colors: {
            ...DEFAULT_TENANT_THEME.tokens.colors,
            primary: { value: '#8b5cf6', description: 'Purple primary' },
            secondary: { value: '#6366f1', description: 'Indigo secondary' },
            background: { value: '#0f172a', description: 'Dark slate background' },
            surface: { value: 'rgba(30, 41, 59, 0.8)', description: 'Glass surface' },
            text: { value: '#f8fafc', description: 'Light text' },
            textMuted: { value: '#94a3b8', description: 'Muted text' },
            border: { value: 'rgba(255, 255, 255, 0.1)', description: 'Subtle border' },
          },
        },
      },
      neumorphism: {
        ...DEFAULT_TENANT_THEME,
        organizationId,
        preset: 'neumorphism',
        effects: {
          ...DEFAULT_TENANT_THEME.effects,
          globalType: 'neu',
          neumorphism: { ...DEFAULT_TENANT_THEME.effects.neumorphism, enabled: true },
        },
        tokens: {
          ...DEFAULT_TENANT_THEME.tokens,
          colors: {
            ...DEFAULT_TENANT_THEME.tokens.colors,
            primary: { value: '#6366f1', description: 'Soft purple primary' },
            secondary: { value: '#8b5cf6', description: 'Soft indigo secondary' },
            background: { value: '#e0e5ec', description: 'Soft gray background' },
            surface: { value: '#e0e5ec', description: 'Same as background' },
            text: { value: '#374151', description: 'Dark gray text' },
            textMuted: { value: '#6b7280', description: 'Muted text' },
            border: { value: '#d1d5db', description: 'Subtle border' },
          },
        },
      },
      'dark-ui': {
        ...DEFAULT_TENANT_THEME,
        organizationId,
        preset: 'dark-ui',
        tokens: {
          ...DEFAULT_TENANT_THEME.tokens,
          colors: {
            ...DEFAULT_TENANT_THEME.tokens.colors,
            primary: { value: '#22d3ee', description: 'Cyan neon accent' },
            secondary: { value: '#a855f7', description: 'Purple neon accent' },
            background: { value: '#09090b', description: 'Near black background' },
            surface: { value: '#18181b', description: 'Elevated surface' },
            text: { value: '#fafafa', description: 'Bright white text' },
            textMuted: { value: '#71717a', description: 'Muted gray text' },
            border: { value: '#27272a', description: 'Subtle border' },
          },
        },
      },
      'flat-design': {
        ...DEFAULT_TENANT_THEME,
        organizationId,
        preset: 'flat-design',
        tokens: {
          ...DEFAULT_TENANT_THEME.tokens,
          colors: {
            ...DEFAULT_TENANT_THEME.tokens.colors,
            primary: { value: '#1e40af', description: 'Deep navy blue' },
            secondary: { value: '#3b82f6', description: 'Bright blue' },
            background: { value: '#f1f5f9', description: 'Light gray background' },
            surface: { value: '#ffffff', description: 'White surface' },
            text: { value: '#0f172a', description: 'Dark text' },
            textMuted: { value: '#64748b', description: 'Muted text' },
            border: { value: '#cbd5e1', description: 'Light border' },
          },
        },
      },
      'liquid-organic': {
        ...DEFAULT_TENANT_THEME,
        organizationId,
        preset: 'liquid-organic',
        tokens: {
          ...DEFAULT_TENANT_THEME.tokens,
          colors: {
            ...DEFAULT_TENANT_THEME.tokens.colors,
            primary: { value: '#ec4899', description: 'Pink primary' },
            secondary: { value: '#8b5cf6', description: 'Purple secondary' },
            background: { value: '#fdf4ff', description: 'Light pink background' },
            surface: { value: '#ffffff', description: 'White surface' },
            text: { value: '#581c87', description: 'Deep purple text' },
            textMuted: { value: '#a855f7', description: 'Light purple muted' },
            border: { value: '#e9d5ff', description: 'Light purple border' },
          },
        },
      },
    } as any;

    setTheme(presets[presetId] || DEFAULT_TENANT_THEME);
  }, [organizationId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(theme);
      }
      setSnackbar({
        open: true,
        message: 'Theme saved successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save theme. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTheme({ ...DEFAULT_TENANT_THEME, organizationId });
    setSnackbar({
      open: true,
      message: 'Theme reset to default.',
      severity: 'info',
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Theme Customization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customize the visual appearance for your organization
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Presets" />
              <Tab label="Colors" />
              <Tab label="Effects" />
              <Tab label="Components" />
              <Tab label="Spacing" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <PresetSelector
              currentPreset={theme.preset}
              onSelect={handlePresetSelect}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <ColorPaletteEditor
              colors={theme.tokens.colors}
              onChange={handleColorsChange}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GlassmorphismPanel
                  config={theme.effects.glassmorphism}
                  onChange={handleGlassmorphismChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <NeumorphismPanel
                  config={theme.effects.neumorphism}
                  onChange={handleNeumorphismChange}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <ComponentStyleSelector
              components={theme.components}
              globalEffectType={theme.effects.globalType}
              onChange={handleComponentsChange}
              onGlobalChange={handleGlobalEffectChange}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <SpacingEditor
              spacing={theme.tokens.spacing}
              borderRadius={theme.tokens.borderRadius}
              onSpacingChange={handleSpacingChange}
              onBorderRadiusChange={handleBorderRadiusChange}
            />
          </TabPanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ position: 'sticky', top: 16 }}>
            <LivePreview theme={theme} />
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ThemeEditor;
