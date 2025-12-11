import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Slide,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { ReactNode, forwardRef } from "react";

// Slide transition from bottom
const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export function BaseModal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  actions,
  maxWidth = "sm",
  showCloseButton = false,
}: BaseModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          border: isMobile ? "none" : "1px solid #e6e5e5",
          m: isMobile ? 0 : 2,
          maxHeight: isMobile ? "100vh" : "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Mobile: Sticky Header */}
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e6e5e5",
          pb: 2,
          position: isMobile ? "sticky" : "relative",
          top: 0,
          zIndex: 10,
          bgcolor: "#ffffff",
          // Safe area inset for iOS devices
          ...(isMobile && {
            "@supports (padding: max(0px))": {
              pt: "max(24px, env(safe-area-inset-top, 24px))",
            },
          }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
            {icon && (
              <Box
                sx={{
                  bgcolor: "#ff671f",
                  borderRadius: 1,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {icon}
              </Box>
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: { xs: "18px", md: "20px" },
                  color: "#353131",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: { xs: "13px", md: "14px" },
                    color: "#4f4a4a",
                    fontVariationSettings: "'wdth' 100",
                    mt: 0.25,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {showCloseButton && (
            <IconButton 
              onClick={onClose} 
              size={isMobile ? "medium" : "small"}
              sx={{ 
                ml: 1,
                flexShrink: 0,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      {/* Scrollable Content */}
      <DialogContent 
        sx={{ 
          px: { xs: 2, md: 3 },
          pt: '20px !important',
          pb: { xs: 2, md: 3 },
          flex: 1,
          overflowY: "auto",
          // Better scrolling on iOS
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </DialogContent>

      {/* Mobile: Sticky Footer with Actions */}
      {actions && (
        <DialogActions
          sx={{
            borderTop: "1px solid #e6e5e5",
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2 },
            gap: { xs: 1.5, md: 1 },
            position: isMobile ? "sticky" : "relative",
            bottom: 0,
            zIndex: 10,
            bgcolor: "#ffffff",
            flexDirection: { xs: "column", sm: "row" },
            // Safe area inset for iOS devices
            ...(isMobile && {
              "@supports (padding: max(0px))": {
                pb: "max(16px, env(safe-area-inset-bottom, 16px))",
              },
            }),
            // Full width buttons on mobile
            "& > button": {
              width: { xs: "100%", sm: "auto" },
              minHeight: { xs: 48, md: 40 },
              fontSize: { xs: "16px", md: "14px" },
            },
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}