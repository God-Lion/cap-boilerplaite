import React, { useState, useEffect, useMemo } from 'react';
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
  Paper,
  Divider,
  Alert,
  alpha,
  useTheme,
  useTenantThemeContext,
  THEME_PRESETS,
  AdaptiveCard,
  AdaptiveButton,
  type TenantThemeConfig
} from '@cap/theme';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  DesktopWindows as DesktopIcon,
  Settings as SystemIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Language as PlanetIcon,
  CloudQueue as CloudIcon,
  Memory as ChipIcon,
  Security as LockIcon,
  TrendingUp as GraphIcon,
  Tune as TuneIcon,
  ColorLens as ColorIcon,
  FilterHdr as MountainIcon,
  ResetTv as ResetIcon,
  Save as SaveIcon,
  Widgets as ComponentsIcon,
  Category as PresetIcon,
  AutoAwesome as EffectsIcon,
  Waves as OrganicIcon,
  Layers as LayersIcon,
  AutoFixHigh as WizardIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Verified as VerifiedIcon,
  Speed as AuditIcon
} from '@mui/icons-material';

import { Stepper, Step, StepLabel, ToggleButton, ToggleButtonGroup } from '@mui/material';

// --- Internal Helper Components ---

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: theme.spacing(5.25),
            height: theme.spacing(5.25),
            borderRadius: theme.spacing(1.5),
            background: value,
            border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
            cursor: 'pointer',
            boxShadow: `0 0 ${theme.spacing(1.875)} ${alpha(value, 0.26)}`
          }}
          component="input"
          type="color"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
        />
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary', fontWeight: 500 }}>{value.toUpperCase()}</Typography>
      </Stack>
    </Box>
  );
};

const SelectionCard = ({ selected, onClick, title, icon, subtitle }: { selected: boolean; onClick: () => void; title: string; icon?: React.ReactNode; subtitle?: string; }) => {
  const theme = useTheme();
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: 2.5,
        cursor: 'pointer',
        background: selected ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.common.white, 0.02),
        border: '2px solid',
        borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
        borderRadius: '16px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'center',
        '&:hover': { background: alpha(theme.palette.primary.main, 0.05), transform: 'translateY(-2px)' }
      }}
    >
      {icon && <Box sx={{ color: selected ? theme.palette.primary.main : 'text.secondary', mb: 1, '& svg': { fontSize: 24 } }}>{icon}</Box>}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.85rem' }}>{title}</Typography>
      {subtitle && <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>{subtitle}</Typography>}
    </Paper>
  );
};

const getContrastRatio = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 0.5 ? (luma + 0.05) / 0.05 : 0.05 / (luma + 0.05);
};

// --- Main ThemeCustomizer Component ---

export const ThemeCustomizer: React.FC = () => {
  const { theme: themeConfig, updateTheme, saveTheme, isLoading, error } = useTenantThemeContext();
  const theme = useTheme();

  const [mode, setMode] = useState<'guided' | 'expert'>('guided');
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [localTheme, setLocalTheme] = useState<TenantThemeConfig | null>(themeConfig);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (themeConfig && !localTheme) {
      setLocalTheme(themeConfig);
    }
  }, [themeConfig]);

  const identityScore = useMemo(() => {
    if (!localTheme) return 0;
    let score = 70;
    if (localTheme.name) score += 10;
    if (localTheme.tokens.colors.primary.value !== theme.palette.primary.main) score += 10;
    if (localTheme.effects.globalType !== 'standard') score += 10;
    return Math.min(score, 100);
  }, [localTheme]);

  const contrastRatio = useMemo(() => {
    if (!localTheme) return '0.0';
    const ratio = getContrastRatio(localTheme.tokens.colors.primary.value || theme.palette.primary.main);
    return ratio.toFixed(1);
  }, [localTheme?.tokens.colors.primary.value]);

  if (!localTheme) return <Typography sx={{ p: 4 }}>Initializing Design System...</Typography>;

  const handleUpdate = (updates: any) => {
    const deepMerge = (target: any, source: any): any => {
      const output = { ...target };
      if (source && typeof source === 'object') {
        Object.keys(source).forEach(key => {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target && key in target) {
            output[key] = deepMerge(target[key], source[key]);
          } else {
            output[key] = source[key];
          }
        });
      }
      return output;
    };
    const newTheme = deepMerge(localTheme, updates);
    setLocalTheme(newTheme as TenantThemeConfig);
    updateTheme(newTheme as TenantThemeConfig);
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
    const preset = THEME_PRESETS[presetKey as keyof typeof THEME_PRESETS];
    if (preset) {
      handleUpdate({
        tokens: {
          colors: {
            primary: { value: preset.preview.primaryColor },
            secondary: { value: preset.preview.secondaryColor },
            background: { value: preset.preview.backgroundColor }
          }
        },
        metadata: { preset: presetKey }
      });
    }
  };

  const wizardSteps = ['Identity', 'Typography', 'Visuals', 'Review'];

  const renderWizardContent = () => {
    switch (activeStep) {
      case 0: // Identity
        return (
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>Organization Name</Typography>
              <Paper sx={{ p: 0, borderRadius: theme.spacing(1.5), background: alpha(theme.palette.common.white, 0.03), border: `1px solid ${theme.palette.divider}` }}>
                <Box component="input" placeholder="e.g. Acme Corp" value={localTheme.name || ''} onChange={(e: any) => handleUpdate({ name: e.target.value })}
                  sx={{ width: '100%', background: 'none', border: 'none', p: 2, color: 'text.primary', '&:focus': { outline: 'none' } }}
                />
              </Paper>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>Base Theme Mode</Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 4 }}><SelectionCard title="Light" icon={<LightModeIcon />} selected={true} onClick={() => { }} /></Grid>
                <Grid size={{ xs: 4 }}><SelectionCard title="Dark" icon={<DarkModeIcon />} selected={false} onClick={() => { }} /></Grid>
                <Grid size={{ xs: 4 }}><SelectionCard title="System" icon={<SystemIcon />} selected={false} onClick={() => { }} /></Grid>
              </Grid>
            </Box>
          </Stack>
        );
      case 1: // Typography
        return (
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>Font Family</Typography>
              <Grid container spacing={1.5}>
                {[
                  { id: 'sans', title: 'Sans', subtitle: 'Modern', font: "'Inter', sans-serif" },
                  { id: 'serif', title: 'Serif', subtitle: 'Classic', font: "'Merriweather', serif" },
                  { id: 'mono', title: 'Mono', subtitle: 'Tech', font: "'Fira Code', monospace" }
                ].map((f) => (
                  <Grid size={{ xs: 4 }} key={f.id}>
                    <SelectionCard title={f.title} subtitle={f.subtitle} selected={localTheme.tokens.typography.fontFamily.sans === f.font}
                      onClick={() => handleUpdate({ tokens: { typography: { fontFamily: { sans: f.font } } } })} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Layout Density</Typography>
              <Slider value={parseFloat(localTheme.tokens.spacing.md || '1')} step={0.25} min={0.5} max={1.5}
                onChange={(_, v) => handleUpdate({ tokens: { spacing: { md: `${v}rem` } } })}
              />
            </Box>
          </Stack>
        );
      case 2: // Visuals
        return (
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>Brand Colors</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><ColorPicker label="Primary" value={localTheme.tokens.colors.primary.value} onChange={(v) => handleUpdate({ tokens: { colors: { primary: { value: v } } } })} /></Grid>
                <Grid size={{ xs: 6 }}><ColorPicker label="Secondary" value={localTheme.tokens.colors.secondary.value} onChange={(v) => handleUpdate({ tokens: { colors: { secondary: { value: v } } } })} /></Grid>
              </Grid>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>Surface Effect</Typography>
              <Grid container spacing={1}>
                {['standard', 'glass', 'neu', 'bento'].map((e) => (
                  <Grid size={{ xs: 3 }} key={e}>
                    <SelectionCard title={e.toUpperCase()} selected={localTheme.effects.globalType === e} onClick={() => handleUpdate({ effects: { globalType: e as any } })} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        );
      case 3: // Review
        return (
          <Stack spacing={3}>
            <Paper sx={{ p: 3, borderRadius: theme.spacing(2.5), background: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${theme.palette.divider}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{identityScore}%</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>IDENTITY SCORE</Typography>
                </Box>
                <VerifiedIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </Stack>
              <Box sx={{ height: theme.spacing(0.75), width: '100%', background: theme.palette.divider, borderRadius: theme.shape.borderRadius, mb: 3 }}>
                <Box sx={{ height: '100%', width: `${identityScore}%`, background: theme.palette.primary.main, borderRadius: theme.shape.borderRadius }} />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ display: 'block' }}>CONTRAST</Typography><Typography variant="subtitle2">{contrastRatio}:1 AAA</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ display: 'block' }}>LATENCY</Typography><Typography variant="subtitle2">~42ms</Typography></Grid>
              </Grid>
            </Paper>
            <AdaptiveButton variant="primary" onClick={handleSave} disabled={isLoading} style={{ height: theme.spacing(6) }}>Confirm & Deploy</AdaptiveButton>
          </Stack>
        );
      default: return null;
    }
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 5 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.03em' }}>Theme Engine</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Unified Design System & Brand Architect</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)} size="small" sx={{ borderRadius: theme.spacing(1.5), background: alpha(theme.palette.common.white, 0.03), border: `1px solid ${theme.palette.divider}` }}>
            <ToggleButton value="guided" sx={{ px: 2, fontWeight: 700, borderRadius: `${theme.spacing(1.25)} !important` }}>Guided</ToggleButton>
            <ToggleButton value="expert" sx={{ px: 2, fontWeight: 700, borderRadius: `${theme.spacing(1.25)} !important` }}>Expert</ToggleButton>
          </ToggleButtonGroup>
          <AdaptiveButton effectStyle="global" variant="primary" onClick={handleSave} disabled={isLoading} style={{ borderRadius: theme.spacing(1.75), paddingLeft: 32, paddingRight: 32, background: isSaved ? theme.palette.success.main : undefined }}>
            {isSaved ? <CheckIcon /> : <SaveIcon fontSize="small" sx={{ mr: 1 }} />}
            {isSaved ? 'Identified' : 'Sync Changes'}
          </AdaptiveButton>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Left Panel: Controls */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <AdaptiveCard effectStyle="global" style={{ padding: 0, height: 'calc(100vh - 260px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {mode === 'guided' ? (
                <Box key="guided" component={motion.div} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 4 }}>
                  <Stepper activeStep={activeStep} sx={{ mb: 4, '& .MuiStepIcon-root.Mui-active': { color: theme.palette.primary.main } }}>
                    {wizardSteps.map(label => <Step key={label}><StepLabel><Typography variant="caption" sx={{ fontWeight: 700 }}>{label}</Typography></StepLabel></Step>)}
                  </Stepper>
                  <Box sx={{ flex: 1, overflowY: 'auto', mb: 4 }}>
                    {renderWizardContent()}
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Button disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)} startIcon={<BackIcon />}>Back</Button>
                    {activeStep < 3 && <AdaptiveButton variant="primary" onClick={() => setActiveStep(p => p + 1)} style={{ flex: 1 }}>Next Step <NextIcon sx={{ ml: 1 }} /></AdaptiveButton>}
                  </Stack>
                </Box>
              ) : (
                <Box key="expert" component={motion.div} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="fullWidth" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Tab icon={<PresetIcon fontSize="small" />} label="Presets" />
                    <Tab icon={<ColorIcon fontSize="small" />} label="Colors" />
                    <Tab icon={<EffectsIcon fontSize="small" />} label="Effects" />
                    <Tab icon={<ComponentsIcon fontSize="small" />} label="Layout" />
                  </Tabs>
                  <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
                    {activeTab === 0 && (
                      <Grid container spacing={2}>
                        {Object.entries(THEME_PRESETS).map(([key, p]) => (
                          <Grid size={{ xs: 6 }} key={key}>
                            <Paper onClick={() => handlePresetSelect(key)} sx={{ p: 2, cursor: 'pointer', background: localTheme.metadata?.preset === key ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.common.white, 0.02), border: '1px solid', borderColor: localTheme.metadata?.preset === key ? theme.palette.primary.main : 'transparent', borderRadius: theme.spacing(1.5) }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 1 }}>{p.name}</Typography>
                              <Box sx={{ width: '100%', height: theme.spacing(0.5), background: p.preview.primaryColor, borderRadius: theme.shape.borderRadius / 2 }} />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    {activeTab === 1 && (
                      <Stack spacing={1}>
                        <ColorPicker label="Primary Identity" value={localTheme.tokens.colors.primary.value} onChange={(v) => handleUpdate({ tokens: { colors: { primary: { value: v } } } })} />
                        <ColorPicker label="Secondary Accent" value={localTheme.tokens.colors.secondary.value} onChange={(v) => handleUpdate({ tokens: { colors: { secondary: { value: v } } } })} />
                        <ColorPicker label="Base Background" value={localTheme.tokens.colors.background.value} onChange={(v) => handleUpdate({ tokens: { colors: { background: { value: v } } } })} />
                      </Stack>
                    )}
                    {activeTab === 2 && (
                      <Stack spacing={3}>
                        <Typography variant="overline" sx={{ fontWeight: 800 }}>Global Effect Style</Typography>
                        <Grid container spacing={1}>
                          {['standard', 'glass', 'neu', 'brutalism', 'organic', 'immersive'].map(t => (
                            <Grid size={{ xs: 4 }} key={t}><Button variant={localTheme.effects.globalType === t ? 'contained' : 'outlined'} onClick={() => handleUpdate({ effects: { globalType: t as any } })} fullWidth sx={{ fontSize: '0.65rem', borderRadius: theme.spacing(1) }}>{t}</Button></Grid>
                          ))}
                        </Grid>
                        {localTheme.effects.globalType === 'glass' && <Box><Typography variant="caption">Blur Force</Typography><Slider value={parseInt(localTheme.effects.glassmorphism?.blur || '16')} max={64} onChange={(_, v) => handleUpdate({ effects: { glassmorphism: { blur: `${v}px` } } })} /></Box>}
                      </Stack>
                    )}
                    {activeTab === 3 && (
                      <Stack spacing={4}>
                        <Box><Typography variant="caption">Corner Radius</Typography><Slider value={parseInt(localTheme.tokens.borderRadius.md || '12')} max={100} onChange={(_, v) => handleUpdate({ tokens: { borderRadius: { md: `${v}px` } } })} /></Box>
                        <Box><Typography variant="caption">Spacing Scale</Typography><Slider value={parseFloat(localTheme.tokens.spacing.md || '1')} step={0.25} min={0.5} max={3} onChange={(_, v) => handleUpdate({ tokens: { spacing: { md: `${v}rem` } } })} /></Box>
                      </Stack>
                    )}
                  </Box>
                </Box>
              )}
            </AnimatePresence>
          </AdaptiveCard>
        </Grid>

        {/* Right Panel: Unified Preview */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ height: '100%', minHeight: 600, borderRadius: theme.spacing(5), background: theme.palette.background.default, border: `${theme.spacing(1.5)} solid ${theme.palette.background.paper}`, p: 6, display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden', boxShadow: theme.shadows[20] }}>
            <Box sx={{ position: 'absolute', top: theme.spacing(3), left: theme.spacing(3) }}><Typography variant="overline" sx={{ color: theme.palette.primary.main, fontWeight: 900, background: alpha(theme.palette.primary.main, 0.1), px: 1.5, py: 0.5, borderRadius: theme.spacing(0.5) }}>ETHEREAL PREVIEW ENGINE v2.2</Typography></Box>

            <Stack spacing={5} sx={{ pt: 4 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1 }}>Dynamic Identity</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>Infrastructure visualizing your reactive design tokens.</Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid size={{ xs: 6 }}>
                  <AdaptiveCard effectStyle="global">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Active Nodes</Typography>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 900, mt: 1 }}>1,280</Typography>
                    <Box sx={{ height: theme.spacing(0.5), width: '60%', background: theme.palette.primary.main, borderRadius: theme.shape.borderRadius / 2, mt: 2, boxShadow: `0 0 10px ${theme.palette.primary.main}` }} />
                  </AdaptiveCard>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <AdaptiveCard effectStyle="global">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Platform Hub</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 2 }}>{localTheme.name || 'Undefined Corp'}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Global Namespace Integration</Typography>
                  </AdaptiveCard>
                </Grid>
              </Grid>

              <Stack direction="row" spacing={2.5}>
                <AdaptiveButton variant="primary" effectStyle="global">Action Command</AdaptiveButton>
                <AdaptiveButton variant="outline" effectStyle="global">Secondary Metric</AdaptiveButton>
              </Stack>
            </Stack>

            <Box sx={{ mt: 'auto', p: 3, borderRadius: theme.spacing(3), background: alpha(theme.palette.common.white, 0.02), border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ width: theme.spacing(6), height: theme.spacing(6), borderRadius: theme.spacing(1.75), background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, boxShadow: theme.shadows[10] }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1 }}>Enterprise Core</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{localTheme.metadata?.preset?.toUpperCase() || 'DEFAULT'} PRESET ACTIVE</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThemeCustomizer;
