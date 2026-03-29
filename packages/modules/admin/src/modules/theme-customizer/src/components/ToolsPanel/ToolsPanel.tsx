import { useState } from 'react';
import { Paper, Tab, Tabs, Box, Typography, Stack, Slider, Button } from '@mui/material';
import { Code, Edit, Palette as ColorIcon, FormatSize as TypographyIcon } from '@mui/icons-material';
import type { TenantThemeConfig, ThemePresetId } from '@cap/theme';
import { THEME_PRESETS } from '@cap/theme';
import { EditorPanel } from '../EditorPanel/EditorPanel';

interface ToolsPanelProps {
  onUpdate: (updates: any) => void;
  onPresetSelect: (presetId: ThemePresetId) => void;
  localDraft: TenantThemeConfig;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  onUpdate,
  onPresetSelect,
  localDraft,
}) => {
  const [tab, setTab] = useState<'presets' | 'colors' | 'effects' | 'editor'>('presets');

  return (
    <Paper
      sx={{
        width: { xs: '100%', sm: '320px' },
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Presets" value="presets" />
        <Tab label="Colors" value="colors" />
        <Tab label="Effects" value="effects" />
        <Tab label="Editor" value="editor" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {tab === 'presets' && (
          <Stack spacing={1.5}>
            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant={localDraft.metadata?.preset === key ? 'contained' : 'outlined'}
                onClick={() => onPresetSelect(key as ThemePresetId)}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    background: preset.preview.primaryColor,
                    mr: 1.5,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {preset.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {preset.description.slice(0, 40)}...
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>
        )}

        {tab === 'colors' && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Primary
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  component="input"
                  type="color"
                  value={localDraft.tokens.colors.primary?.value || '#000000'}
                  onChange={(e) =>
                    onUpdate({ tokens: { colors: { primary: { value: e.target.value } } } })
                  }
                  sx={{ width: 48, height: 48, border: 'none', cursor: 'pointer' }}
                />
                <Typography variant="body2" fontFamily="monospace">
                  {localDraft.tokens.colors.primary?.value?.toUpperCase()}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Secondary
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  component="input"
                  type="color"
                  value={localDraft.tokens.colors.secondary?.value || '#000000'}
                  onChange={(e) =>
                    onUpdate({ tokens: { colors: { secondary: { value: e.target.value } } } })
                  }
                  sx={{ width: 48, height: 48, border: 'none', cursor: 'pointer' }}
                />
                <Typography variant="body2" fontFamily="monospace">
                  {localDraft.tokens.colors.secondary?.value?.toUpperCase()}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Background
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  component="input"
                  type="color"
                  value={localDraft.tokens.colors.background?.value || '#ffffff'}
                  onChange={(e) =>
                    onUpdate({ tokens: { colors: { background: { value: e.target.value } } } })
                  }
                  sx={{ width: 48, height: 48, border: 'none', cursor: 'pointer' }}
                />
                <Typography variant="body2" fontFamily="monospace">
                  {localDraft.tokens.colors.background?.value?.toUpperCase()}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        )}

        {tab === 'effects' && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Effect Style
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['standard', 'glass', 'neu', 'brutalism', 'organic', 'immersive'].map((effect) => (
                  <Button
                    key={effect}
                    size="small"
                    variant={localDraft.effects?.globalType === effect ? 'contained' : 'outlined'}
                    onClick={() => onUpdate({ effects: { globalType: effect as any } })}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {effect}
                  </Button>
                ))}
              </Stack>
            </Box>

            {localDraft.effects?.globalType === 'glass' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Blur: {localDraft.effects.glassmorphism?.blur || '16px'}
                </Typography>
                <Slider
                  value={parseInt(localDraft.effects.glassmorphism?.blur || '16', 10)}
                  min={0}
                  max={64}
                  onChange={(_, v) =>
                    onUpdate({ effects: { glassmorphism: { blur: `${v}px` } } })
                  }
                />
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Border Radius
              </Typography>
              <Slider
                value={parseInt(localDraft.tokens.borderRadius?.md || '8', 10)}
                min={0}
                max={32}
                onChange={(_, v) =>
                  onUpdate({ tokens: { borderRadius: { md: `${v}px` } } })
                }
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}px`}
              />
            </Box>
          </Stack>
        )}

        {tab === 'editor' && (
          <EditorPanel />
        )}
      </Box>
    </Paper>
  );
};
