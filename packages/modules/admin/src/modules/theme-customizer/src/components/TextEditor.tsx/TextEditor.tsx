import {
  Box,
  Slider,
  Typography,
} from "@mui/material";
import { useThemeCustomizer } from "@cap/theme";
import { FieldGroupContainer } from "../FieldGroupContainer/FieldGroupContainer";
import { NumberSpecifier } from "../NumberSpecifier/NumberSpecifier";

const FONTS = [
  "'Inter', sans-serif",
  "'Roboto', sans-serif",
  "'Open Sans', sans-serif",
  "'Lato', sans-serif",
  "'Montserrat', sans-serif",
  "'Merriweather', serif",
  "'Playfair Display', serif",
  "'Fira Code', monospace",
  "'JetBrains Mono', monospace",
];

export const TextEditor = () => {
  const { localDraft, applyDraftUpdate } = useThemeCustomizer();

  const currentFontSize = parseFloat(localDraft.tokens.typography?.fontSize?.base || '16');
  const currentFontFamily = localDraft.tokens.typography?.fontFamily?.sans || "'Inter', sans-serif";

  return (
    <>
      <FieldGroupContainer title="Base Font Size">
        <NumberSpecifier
          unit="px"
          isDefault={currentFontSize === 16}
          min={12}
          max={20}
          step={1}
          value={currentFontSize}
          onChange={(num) =>
            applyDraftUpdate({ tokens: { typography: { fontSize: { base: `${num}px` } } } as any })
          }
          onReset={() =>
            applyDraftUpdate({ tokens: { typography: { fontSize: { base: '16px' } } } as any })
          }
        />
      </FieldGroupContainer>
      <FieldGroupContainer title="Font Family">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {FONTS.map((font) => (
            <Box
              key={font}
              onClick={() => applyDraftUpdate({ tokens: { typography: { fontFamily: { sans: font } } } as any })}
              sx={{
                p: 1.5,
                borderRadius: 1,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: currentFontFamily === font ? 'primary.main' : 'divider',
                backgroundColor: currentFontFamily === font ? 'action.selected' : 'transparent',
                fontFamily: font,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography variant="body2">{font}</Typography>
            </Box>
          ))}
        </Box>
      </FieldGroupContainer>
    </>
  );
};
