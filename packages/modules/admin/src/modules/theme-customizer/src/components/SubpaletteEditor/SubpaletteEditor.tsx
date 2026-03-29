import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useThemeCustomizer } from "@cap/theme";
import { ColorPicker } from "../ColourPicker/ColorPicker";
import { FieldGroupContainer } from "../FieldGroupContainer/FieldGroupContainer";

const COLOR_KEYS: Record<string, string[]> = {
  primary: ["primary"],
  secondary: ["secondary"],
  background: ["background", "surface"],
  text: ["text", "textMuted"],
  success: ["success"],
  warning: ["warning"],
  error: ["error"],
  info: ["info"],
  divider: ["border"],
};

interface SubpaletteEditorProps {
  name: keyof typeof COLOR_KEYS;
}

export const SubpaletteEditor = ({ name }: SubpaletteEditorProps) => {
  const { localDraft, applyDraftUpdate } = useThemeCustomizer();
  const [showAll, setShowAll] = useState(false);

  const colorKeys = COLOR_KEYS[name] || [name];
  const visibleKeys = showAll ? colorKeys : colorKeys.slice(0, 1);

  const getColorValue = (key: string): string => {
    const colors = localDraft.tokens.colors;
    if (key === 'border') return colors.border?.value || '#e2e8f0';
    if (key === 'textMuted') return colors.textMuted?.value || '#64748b';
    return colors[key as keyof typeof colors]?.value || '#000000';
  };

  const handleColorChange = (key: string, value: string) => {
    if (key === 'border') {
      applyDraftUpdate({ tokens: { colors: { border: { value } } } } as any);
    } else if (key === 'textMuted') {
      applyDraftUpdate({ tokens: { colors: { textMuted: { value } } } } as any);
    } else {
      applyDraftUpdate({ tokens: { colors: { [key]: { value } } } } as any);
    }
  };

  const defaults: Record<string, string> = {
    primary: '#D4AF37',
    secondary: '#8B4513',
    background: '#F5F5DC',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    border: '#e2e8f0',
  };

  const isDefault = (key: string): boolean => {
    return getColorValue(key) === (defaults[key] || '#000000');
  };

  const handleReset = (key: string) => {
    handleColorChange(key, defaults[key] || '#000000');
  };

  return (
    <FieldGroupContainer
      title={name}
      actions={
        colorKeys.length > 1 ? (
          <Button size="small" color="secondary" sx={{ p: 0 }} onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? "Show less" : `Show ${colorKeys.length - 1} more`}
          </Button>
        ) : undefined
      }
    >
      {visibleKeys.map((key) => (
        <ColorPicker
          name={`${name}-${key}`}
          title={key}
          key={key}
          value={getColorValue(key)}
          isDefault={isDefault(key)}
          onChange={(hex) => handleColorChange(key, hex)}
          onReset={() => handleReset(key)}
        />
      ))}
    </FieldGroupContainer>
  );
};
