import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Grid, 
  Slider, 
  Switch, 
  FormControlLabel, 
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { 
  ColorLens as ColorIcon, 
  SelectAll as PresetIcon, 
  BlurOn as EffectsIcon, 
  Widgets as ComponentsIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useTenantThemeContext, 
  THEME_PRESETS, 
  GlassCard, 
  GlassButton, 
  type TenantThemeConfig 
} from '@cap/theme';

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', display: 'block', mb: 1 }}>{label}</Typography>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box 
        sx={{ 
          width: 36, 
          height: 36, 
          borderRadius: '8px', 
          background: value, 
          border: '2px solid rgba(255,255,255,0.1)',
          cursor: 'pointer'
        }} 
        component="input"
        type="color"
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'var(--color-text)' }}>{value}</Typography>
    </Stack>
  </Box>
);

export const ThemeCustomizer: React.FC = () => {
  const { theme, updateTheme, saveTheme, isLoading, error } = useTenantThemeContext();
  const [activeTab, setActiveTab] = useState(0);
  const [localTheme, setLocalTheme] = useState<TenantThemeConfig | null>(theme);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (theme && !localTheme) {
      setLocalTheme(theme);
    }
  }, [theme]);

  if (!localTheme) return <Typography>Loading theme configuration...</Typography>;

  const handleUpdate = (updates: Partial<TenantThemeConfig>) => {
    const newTheme = { ...localTheme, ...updates };
    setLocalTheme(newTheme);
    updateTheme(newTheme); // Real-time preview
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      await saveTheme(localTheme);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = (THEME_PRESETS as any)[presetKey];
    if (preset) {
      handleUpdate({
        ...preset,
        organizationId: localTheme.organizationId // Preserve org ID
      });
    }
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Theme Customizer</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Fully customize your organization's visual identity. Changes are applied in real-time to the preview.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={() => handlePresetSelect('godlio-obsidian')} title="Reset to default">
            <ResetIcon sx={{ color: 'var(--color-text-muted)' }} />
          </IconButton>
          <Button 
            variant="contained" 
            startIcon={isSaved ? <CheckIcon /> : <SaveIcon />}
            onClick={handleSave}
            disabled={isLoading}
            sx={{ 
              background: isSaved ? 'var(--color-success, #4caf50)' : 'var(--color-primary, #635bff)',
              '&:hover': { background: isSaved ? '#43a047' : '#534bae' }
            }}
          >
            {isSaved ? 'Published' : 'Publish Changes'}
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Controls Panel */}
        <Grid size={{ xs: 12, md: 5 }}>
          <GlassCard padding="0">
            <Tabs 
              value={activeTab} 
              onChange={(_, v) => setActiveTab(v)}
              variant="fullWidth"
              sx={{ 
                borderBottom: '1px solid var(--color-border)',
                '& .MuiTab-root': { color: 'var(--color-text-muted)', minHeight: 64 },
                '& .Mui-selected': { color: 'var(--color-primary) !important' },
                '& .MuiTabs-indicator': { backgroundColor: 'var(--color-primary)' }
              }}
            >
              <Tab icon={<PresetIcon />} label="Presets" />
              <Tab icon={<ColorIcon />} label="Colors" />
              <Tab icon={<EffectsIcon />} label="Effects" />
              <Tab icon={<ComponentsIcon />} label="UI" />
            </Tabs>

            <Box sx={{ p: 4, maxHeight: '60vh', overflowY: 'auto' }}>
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <Stack 
                    component={motion.div} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    spacing={2}
                  >
                    {Object.entries(THEME_PRESETS as any).map(([key, preset]: [string, any]) => (
                      <Paper
                        key={key}
                        onClick={() => handlePresetSelect(key)}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid',
                          borderColor: localTheme.metadata?.preset === key ? 'var(--color-primary)' : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': { background: 'rgba(255,255,255,0.07)' }
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{preset.metadata?.name || key}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: preset.tokens.colors.primary }} />
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: preset.tokens.colors.secondary }} />
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: preset.tokens.colors.background }} />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}

                {activeTab === 1 && (
                  <Box 
                    component={motion.div} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ColorPicker 
                      label="Primary Color" 
                      value={localTheme.tokens.colors.primary.value} 
                      onChange={(v) => handleUpdate({ tokens: { ...localTheme.tokens, colors: { ...localTheme.tokens.colors, primary: { value: v } } } })}
                    />
                    <ColorPicker 
                      label="Secondary Color" 
                      value={localTheme.tokens.colors.secondary.value} 
                      onChange={(v) => handleUpdate({ tokens: { ...localTheme.tokens, colors: { ...localTheme.tokens.colors, secondary: { value: v } } } })}
                    />
                    <Divider sx={{ my: 3, borderColor: 'var(--color-border)' }} />
                    <ColorPicker 
                      label="Background" 
                      value={localTheme.tokens.colors.background.value} 
                      onChange={(v) => handleUpdate({ tokens: { ...localTheme.tokens, colors: { ...localTheme.tokens.colors, background: { value: v } } } })}
                    />
                    <ColorPicker 
                      label="Surface Accent" 
                      value={localTheme.tokens.colors.surface.value} 
                      onChange={(v) => handleUpdate({ tokens: { ...localTheme.tokens, colors: { ...localTheme.tokens.colors, surface: { value: v } } } })}
                    />
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box 
                    component={motion.div} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Box sx={{ mb: 4 }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={localTheme.effects.glassmorphism.enabled} 
                            onChange={(e) => handleUpdate({ 
                              effects: { 
                                ...localTheme.effects, 
                                glassmorphism: { ...localTheme.effects.glassmorphism, enabled: e.target.checked } 
                              } 
                            })}
                          />
                        }
                        label="Enable Glassmorphism"
                      />
                      {localTheme.effects.glassmorphism.enabled && (
                        <Stack spacing={2} sx={{ mt: 2, pl: 2 }}>
                          <Box>
                            <Typography variant="caption">Blur Intensity</Typography>
                            <Slider 
                              value={parseInt(localTheme.effects.glassmorphism.blur)} 
                              min={0} max={40} 
                              onChange={(_, v) => handleUpdate({ effects: { ...localTheme.effects, glassmorphism: { ...localTheme.effects.glassmorphism, blur: `${v}px` } } })}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption">Opacity</Typography>
                            <Slider 
                              value={localTheme.effects.glassmorphism.opacity * 100} 
                              min={0} max={100} 
                              onChange={(_, v) => handleUpdate({ effects: { ...localTheme.effects, glassmorphism: { ...localTheme.effects.glassmorphism, opacity: (v as number) / 100 } } })}
                            />
                          </Box>
                        </Stack>
                      )}
                    </Box>

                    <Box>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={localTheme.effects.neumorphism.enabled} 
                            onChange={(e) => handleUpdate({ 
                              effects: { 
                                ...localTheme.effects, 
                                neumorphism: { ...localTheme.effects.neumorphism, enabled: e.target.checked } 
                              } 
                            })}
                          />
                        }
                        label="Enable Neumorphism"
                      />
                    </Box>
                  </Box>
                )}

                {activeTab === 3 && (
                  <Box 
                    component={motion.div} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Border Radius</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Box>
                          <Typography variant="caption">Small</Typography>
                          <Slider 
                            value={parseInt(localTheme.tokens.borderRadius.sm)} 
                            min={0} max={20} 
                            onChange={(_, v) => handleUpdate({ tokens: { ...localTheme.tokens, borderRadius: { ...localTheme.tokens.borderRadius, sm: `${v}px` } } })}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box>
                          <Typography variant="caption">Large</Typography>
                          <Slider 
                            value={parseInt(localTheme.tokens.borderRadius.lg)} 
                            min={0} max={40} 
                            onChange={(_, v) => handleUpdate({ tokens: { ...localTheme.tokens, borderRadius: { ...localTheme.tokens.borderRadius, lg: `${v}px` } } })}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          </GlassCard>
        </Grid>

        {/* Preview Panel */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ 
            height: '100%', 
            minHeight: 500,
            borderRadius: '24px', 
            background: localTheme.tokens.colors.background.value,
            border: '8px solid rgba(255,255,255,0.05)',
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            overflow: 'hidden',
            position: 'relative'
          }}>
             <Typography variant="overline" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>Live Preview</Typography>
             
             <Stack spacing={3}>
                <Typography variant="h5" sx={{ color: 'var(--color-text)' }}>Welcome to our Platform</Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <GlassCard>
                      <Typography variant="subtitle2">Analytics Card</Typography>
                      <Typography variant="h4" sx={{ mt: 1, color: 'var(--color-primary)' }}>12.4k</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>+14% from last month</Typography>
                    </GlassCard>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <GlassCard>
                       <Typography variant="subtitle2">System Health</Typography>
                       <Box sx={{ mt: 2, height: 4, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                          <Box sx={{ height: '100%', width: '70%', background: 'var(--color-secondary)', borderRadius: 2 }} />
                       </Box>
                    </GlassCard>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                  <GlassButton variant="primary">Primary Action</GlassButton>
                  <GlassButton variant="secondary">Secondary</GlassButton>
                  <GlassButton variant="outline">Outline</GlassButton>
                </Stack>
             </Stack>

             {/* Dynamic Branding Name */}
             <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Godlio Enterprise</Typography>
             </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThemeCustomizer
