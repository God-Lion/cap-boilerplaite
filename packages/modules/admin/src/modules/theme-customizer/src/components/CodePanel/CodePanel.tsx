import { ContentCopy } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useThemeCustomizer } from "@cap/theme";

export const CodePanel = () => {
  const { localDraft } = useThemeCustomizer();
  const [codeHtml, setCodeHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initHighlighter = async () => {
      try {
        const { createHighlighter } = await import("shiki");
        const highlighter = await createHighlighter({
          themes: ["ayu-dark"],
          langs: ["javascript"],
        });

        if (!mounted) return;

        const code = `const themeConfig = ${JSON.stringify(localDraft, null, 2)};

export default themeConfig;`;

        const html = highlighter.codeToHtml(code, {
          lang: "javascript",
          theme: "ayu-dark",
        });

        setCodeHtml(html);
      } catch (error) {
        console.error("Failed to load highlighter:", error);
        if (mounted) {
          setCodeHtml(`<pre style="color: #ccc; padding: 16px;">${JSON.stringify(localDraft, null, 2)}</pre>`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initHighlighter();

    return () => {
      mounted = false;
    };
  }, [localDraft]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(localDraft, null, 2));
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: "0px 1 1", position: "relative" }}>
      <Stack direction="row" sx={{ p: 2, py: 1, alignItems: "center", justifyContent: "space-between" }}>
        <Typography>TenantThemeConfig</Typography>
        <Tooltip title="Copy">
          <IconButton onClick={handleCopy}>
            <ContentCopy />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "auto" }}>
        {isLoading ? (
          <Typography sx={{ p: 2 }} color="text.secondary">Loading...</Typography>
        ) : (
          <Box sx={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: codeHtml }} />
        )}
      </Box>
    </Box>
  );
};
