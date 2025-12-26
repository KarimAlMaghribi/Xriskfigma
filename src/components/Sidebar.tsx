import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  ColorLens as ColorLensIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import imgImageXriskLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

export type SidebarPage =
  | "home"
  | "marketplace"
  | "messages"
  | "account"
  | "designsystem";

interface SidebarProps {
  currentPage: SidebarPage;
  unreadMessages?: number;
  onNavigate: (page: SidebarPage) => void;
  onNewRisk: () => void;
  onLogout?: () => void;
}

export function Sidebar({
  currentPage,
  unreadMessages = 0,
  onNavigate,
  onNewRisk,
  onLogout,
}: SidebarProps) {
  const navItems: { key: SidebarPage; label: string; icon: JSX.Element }[] = [
    { key: "home", label: "Dashboard", icon: <DashboardIcon /> },
    { key: "marketplace", label: "Risikomarkt", icon: <ShoppingCartIcon /> },
    { key: "messages", label: "Nachrichten", icon: <ChatIcon /> },
    { key: "account", label: "Konto", icon: <SettingsIcon /> },
    { key: "designsystem", label: "Design System", icon: <ColorLensIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: "1px solid #e6e5e5",
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        p: 2,
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar src={imgImageXriskLogo} alt="XRISK" sx={{ width: 40, height: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#353131" }}>
          XRISK
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          bgcolor: "#ff671f",
          color: "#fff",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          "&:hover": { bgcolor: "#e65b1c" },
        }}
        onClick={onNewRisk}
        fullWidth
      >
        Anliegen erstellen
      </Button>

      <Divider />

      <List sx={{ p: 0 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.key}
            selected={currentPage === item.key}
            onClick={() => onNavigate(item.key)}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              color: currentPage === item.key ? "#ff671f" : "#4f4a4a",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              {item.key === "messages" && unreadMessages > 0 ? (
                <Badge color="error" badgeContent={unreadMessages}>
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {onLogout && (
        <Button
          variant="text"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{ justifyContent: "flex-start", color: "#4f4a4a" }}
        >
          Logout
        </Button>
      )}
    </Box>
  );
}
