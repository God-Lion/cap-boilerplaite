import { Check, Settings, Info as InfoIcon } from "@mui/icons-material";
import { Divider, Paper, Stack, Typography } from "@mui/material";
import { useThemeCustomizer } from "@cap/theme";
import { ComponentList } from "../ComponentList/ComponentList";

export const InfoPanel = () => {
  const { isDirty } = useThemeCustomizer();

  return (
    <Paper
      sx={{
        flexDirection: "column",
        gap: 1,
        display: { xs: "none", sm: "flex" },
        flex: "0 0 200px",
        p: 2,
      }}
    >
      <Stack>
        <Typography variant="h5">Theme Builder</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Customize your tenant theme
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Settings fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          Real-time preview
        </Typography>
      </Stack>

      {isDirty && (
        <Stack
          direction="row"
          sx={{ gap: 0.5, borderRadius: "99px", bgcolor: "background.default", p: 0.5, paddingInlineEnd: 1, alignContent: "center", mt: 1 }}
        >
          <Check color="success" fontSize="small" />
          <Typography variant="subtitle2" color="text.secondary">
            Unsaved changes
          </Typography>
        </Stack>
      )}

      <Divider sx={{ my: 1 }} />

      <Typography variant="h6">Preview Components</Typography>
      <ComponentList />

      <Divider sx={{ my: 1 }} />

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
        <InfoIcon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          Changes apply to all tenants
        </Typography>
      </Stack>
    </Paper>
  );
};
