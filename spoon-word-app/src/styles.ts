import { Box, Button, Typography, styled } from "@mui/material";

export const SectionLabel = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.text.secondary,
    marginBottom: 8
}));

export const AlphaRow = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
    gap: 8
}));

export const KeyBtn = styled(Button, {
    shouldForwardProp: (p) => p !== "active"
})<{ active?: boolean }>(({ theme, active }) => ({
    minWidth: 36,
    height: 36,
    padding: 0,
    borderRadius: 10,
    fontWeight: 700,
    border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    background: active ? theme.palette.primary.main + "20" : "transparent",
    "&:hover": {
        borderColor: theme.palette.primary.main,
        background: theme.palette.primary.main + "14"
    }
}));