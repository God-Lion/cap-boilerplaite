import { useMemo } from 'react';
import { Box, Stack, ThemeProvider, Button, Typography, IconButton, alpha } from '@mui/material';
import { ResetTv as ResetIcon, Save as SaveIcon, Check as CheckIcon } from '@mui/icons-material';
import {
  useThemeCustomizer,
  useThemeSettings,
  composeMuiTheme,
} from '@cap/theme';
import { InfoPanel } from '../components/InfoPanel/InfoPanel';
import { ToolsPanel } from '../components/ToolsPanel/ToolsPanel';
import { MockApp } from '../components/MockApp/MockApp';

export const ThemeBuilder: React.FC = () => {
  const settings = useThemeSettings();
  const { localDraft, isDirty, isSaving, applyDraftUpdate, applyDraftPreset, resetDraft, commitDraft } =
    useThemeCustomizer();

  const derivedTheme = useMemo(() => {
    return composeMuiTheme({
      currentMode: localDraft.metadata?.mode === 'dark' ? 'dark' : 'light',
      settings,
      tenantTheme: localDraft,
    });
  }, [localDraft, settings]);

  const handleReset = () => {
    resetDraft();
  };

  const handleSave = async () => {
    await commitDraft();
  };

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        display: 'flex',
        alignContent: 'stretch',
        height: '100dvh',
      }}
    >
      <InfoPanel />
      <Stack
        sx={{
          height: '100dvh',
          flex: '1 1 1px',
          alignContent: 'stretch',
          background: 'conic-gradient(#666 25%, #585858 0 50%, #666 0 75%, #585858 0) 0 0/25px 25px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            minHeight: 0,
            flexGrow: 1,
            padding: { xs: 2, sm: 3, md: 4 },
            pb: 3,
          }}
        >
          <ThemeProvider theme={derivedTheme}>
            <MockApp />
          </ThemeProvider>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            background: (theme) => alpha(theme.palette.background.paper, 0.9),
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {isDirty ? 'Unsaved changes' : 'All changes saved'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={handleReset}
              disabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={isSaving ? <CheckIcon /> : <SaveIcon />}
              onClick={handleSave}
              disabled={!isDirty || isSaving}
            >
              {isSaving ? 'Saved' : 'Save Changes'}
            </Button>
          </Stack>
        </Box>
      </Stack>
      <ToolsPanel
        onUpdate={applyDraftUpdate}
        onPresetSelect={applyDraftPreset}
        localDraft={localDraft}
      />
    </Box>
  );
};

export default ThemeBuilder;
