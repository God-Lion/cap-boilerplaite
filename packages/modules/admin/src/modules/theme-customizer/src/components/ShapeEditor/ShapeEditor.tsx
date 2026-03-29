import { Switch } from "@mui/material";
import { useThemeCustomizer } from "@cap/theme";
import { FieldGroupContainer } from "../FieldGroupContainer/FieldGroupContainer";
import { NumberSpecifier } from "../NumberSpecifier/NumberSpecifier";

export const ShapeEditor = () => {
  const { localDraft, applyDraftUpdate } = useThemeCustomizer();

  const currentRadius = parseInt(localDraft.tokens.borderRadius?.md || '8', 10);
  const currentSpacing = parseFloat(localDraft.tokens.spacing?.md || '1');

  return (
    <>
      <FieldGroupContainer title="Border Radius">
        <NumberSpecifier
          unit="px"
          isDefault={currentRadius === 8}
          min={0}
          max={24}
          step={0.5}
          value={currentRadius}
          onChange={(num) =>
            applyDraftUpdate({ tokens: { borderRadius: { md: `${num}px` } } })
          }
          onReset={() =>
            applyDraftUpdate({ tokens: { borderRadius: { md: '8px' } } })
          }
        />
      </FieldGroupContainer>
      <FieldGroupContainer title="Spacing">
        <NumberSpecifier
          unit="rem"
          min={0.5}
          max={2}
          step={0.25}
          isDefault={currentSpacing === 1}
          value={currentSpacing}
          onChange={(num) =>
            applyDraftUpdate({ tokens: { spacing: { md: `${num}rem` } } })
          }
          onReset={() =>
            applyDraftUpdate({ tokens: { spacing: { md: '1rem' } } })
          }
        />
      </FieldGroupContainer>
    </>
  );
};
