import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useThemeCustomizer } from "@cap/theme";
import { FieldGroupContainer } from "../FieldGroupContainer/FieldGroupContainer";
import { SubpaletteEditor } from "../SubpaletteEditor/SubpaletteEditor";

export const PaletteEditor = () => {
  const { localDraft, applyDraftUpdate } = useThemeCustomizer();

  const currentMode = localDraft.metadata?.mode || 'light';

  return (
    <>
      <FieldGroupContainer>
        <ToggleButtonGroup
          fullWidth
          value={currentMode}
          exclusive
          onChange={(_, value: "light" | "dark" | "system" | null) => {
            if (!value) return;
            applyDraftUpdate({ metadata: { ...localDraft.metadata, mode: value } });
          }}
        >
          <ToggleButton value="light">Light</ToggleButton>
          <ToggleButton value="dark">Dark</ToggleButton>
          <ToggleButton value="system">System</ToggleButton>
        </ToggleButtonGroup>
      </FieldGroupContainer>
      <SubpaletteEditor name="primary" />
      <SubpaletteEditor name="secondary" />
      <SubpaletteEditor name="background" />
      <SubpaletteEditor name="text" />
      <SubpaletteEditor name="success" />
      <SubpaletteEditor name="warning" />
      <SubpaletteEditor name="error" />
      <SubpaletteEditor name="info" />
      <SubpaletteEditor name="divider" />
    </>
  );
};
