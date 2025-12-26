import { useRef, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Marketplace } from "./components/Marketplace";
import { DesignSystem } from "./components/DesignSystem";
import { LandingPage } from "./components/LandingPage";
import { RisktakerLandingPage } from "./components/RisktakerLandingPage";
import { RiskInputModal } from "./components/RiskInputModal";
import { Sidebar } from "./components/Sidebar";
import { Messages } from "./components/Messages";
import { AccountSettings } from "./components/AccountSettings";
import { TakeRiskModal } from "./components/TakeRiskModal";
import { RiskDetailDialog } from "./components/RiskDetailDialog";
import { UserProfileDialog } from "./components/UserProfileDialog";
import { ImpressumPage } from "./components/legal/ImpressumPage";
import { DatenschutzPage } from "./components/legal/DatenschutzPage";
import { AGBPage } from "./components/legal/AGBPage";
import { Risk } from "./types/risk";
import { toast } from "sonner@2.0.3";
import { mockConversations } from "./lib/messages-mock-data";
import { users } from "./lib/user-mock-data";
import imgImageXriskLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";
import {
  Box,
  ThemeProvider,
  createTheme,
  Drawer,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Toaster } from "./components/ui/sonner";

type Page =
  | "home"
  | "marketplace"
  | "messages"
  | "account"
  | "designsystem"
  | "take-risk"
  | "impressum"
  | "datenschutz"
  | "agb";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff671f",
      light: "#ff8548",
      dark: "#e05a1b",
      contrastText: "#e6e5e5",
    },
    secondary: {
      main: "#353131",
      light: "#4f4a4a",
      dark: "#030213",
    },
    background: {
      default: "#fdfcfc",
      paper: "#ffffff",
    },
    text: {
      primary: "#353131",
      secondary: "#4f4a4a",
    },
    divider: "#e6e5e5",
    success: {
      main: "#00a63e",
    },
    error: {
      main: "#f54900",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 900,
      fontSize: "32px",
      color: "#353131",
    },
    h6: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 900,
      fontSize: "24px",
    },
    body1: {
      fontFamily: "'Inter', sans-serif",
      fontSize: "16px",
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
      fontSize: "14px",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid #e6e5e5",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          fontSize: "16px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 200,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            "& fieldset": {
              borderColor: "#e6e5e5",
              "& legend": {
                fontSize: "0.75em",
              },
            },
            "&:hover fieldset": {
              borderColor: "#ff671f",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff671f",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root": {
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            color: "#4F4A4A",
            backgroundColor: "#ffffff",
            paddingLeft: "4px",
            paddingRight: "4px",
            "&.Mui-focused": {
              color: "#ff671f",
            },
            "&.MuiInputLabel-shrink": {
              backgroundColor: "#ffffff",
            },
          },
        },
      },
    },
  },
});

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userType, setUserType] = useState<"risikogeber" | "risikonehmer">("risikogeber");
  const [newRisks, setNewRisks] = useState<Risk[]>([]);
  const lastToastStatusRef = useRef<Record<string, Risk["status"]>>({});
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [takeRiskModalOpen, setTakeRiskModalOpen] = useState(false);
  const [riskDetailDialogOpen, setRiskDetailDialogOpen] = useState(false);
  const [riskDetailContext, setRiskDetailContext] = useState<'marketplace' | 'own' | 'taken'>('marketplace');
  const [userProfileDialogOpen, setUserProfileDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handleUserTypeChange = (type: "risikogeber" | "risikonehmer") => {
    setUserType(type);
  };

  const handleRiskCreated = (risk: Risk) => {
    setNewRisks((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === risk.id);
      if (existingIndex !== -1) {
        const updatedRisk = { ...prev[existingIndex], ...risk };
        const updatedList = [...prev];
        updatedList[existingIndex] = updatedRisk;
        return updatedList;
      }

      return [risk, ...prev];
    });

    setCurrentPage("home");

    const previousStatus = lastToastStatusRef.current[risk.id];
    if (previousStatus === risk.status) {
      return;
    }

    lastToastStatusRef.current[risk.id] = risk.status;

    if (risk.status === "completed") {
      setRiskModalOpen(false);
      toast.success(`Risiko "${risk.title}" abgeschlossen`, {
        description: "Die Analyse wurde erfolgreich abgeschlossen.",
        duration: 5000,
      });
    } else {
      toast.info(`Risiko "${risk.title}" wurde angelegt`, {
        description: "Die Risikaanalyse läuft gerade noch im Hintergrund.",
        duration: 4000,
      });
    }
  };

  const handleDeleteRisk = (riskId: string) => {
    setNewRisks((prev) => prev.filter((r) => r.id !== riskId));
  };

  const handleOpenRiskModal = () => {
    setRiskModalOpen(true);
  };

  const handleRiskDetails = (risk: Risk, context: 'marketplace' | 'own' | 'taken' = 'marketplace') => {
    setSelectedRisk(risk);
    setRiskDetailContext(context);
    // Always use drawer for consistency on both mobile and desktop
    setRiskDetailDialogOpen(true);
  };

  const handleBackFromDetails = () => {
    setSelectedRisk(null);
    setRiskDetailDialogOpen(false);
    setCurrentPage("home");
  };

  const handleCloseRiskDetailDialog = () => {
    setRiskDetailDialogOpen(false);
    setSelectedRisk(null);
  };

  const handleBackFromTakeRisk = () => {
    setSelectedRisk(null);
    setCurrentPage("marketplace");
  };

  const handleTakeRiskFromDetail = (risk: Risk) => {
    setSelectedRisk(risk);
    if (isMobile) {
      // Mobile: Use modal
      setTakeRiskModalOpen(true);
    } else {
      // Desktop: Close detail drawer and open take risk drawer
      setRiskDetailDialogOpen(false);
      setTakeRiskModalOpen(true);
    }
  };

  const handleTakeRiskFromMarketplace = (risk: Risk) => {
    setSelectedRisk(risk);
    if (isMobile) {
      // Mobile: Open detail drawer with marketplace context
      setRiskDetailContext('marketplace');
      setRiskDetailDialogOpen(true);
    } else {
      // Desktop: Open take risk drawer
      setTakeRiskModalOpen(true);
    }
  };

  const handleCloseTakeRiskModal = () => {
    setTakeRiskModalOpen(false);
    setSelectedRisk(null);
  };

  const handleTakeRiskSubmit = (premium: number, coverages: string[]) => {
    console.log("Take risk submitted:", { premium, coverages });
    toast.success("Angebot erfolgreich abgegeben", {
      description: "Der Risikogeber wird über Ihr Angebot informiert.",
      duration: 5000,
    });
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setUserProfileDialogOpen(true);
  };

  const handleCloseUserProfileDialog = () => {
    setUserProfileDialogOpen(false);
    setSelectedUserId(null);
  };

  // Show Landing Page if not logged in
  if (!isLoggedIn) {
    if (currentPage === "impressum") {
      return (
        <ThemeProvider theme={theme}>
          <ImpressumPage 
            onNavigateBack={() => setCurrentPage("home")}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        </ThemeProvider>
      );
    }
    if (currentPage === "datenschutz") {
      return (
        <ThemeProvider theme={theme}>
          <DatenschutzPage 
            onNavigateBack={() => setCurrentPage("home")}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        </ThemeProvider>
      );
    }
    if (currentPage === "agb") {
      return (
        <ThemeProvider theme={theme}>
          <AGBPage 
            onNavigateBack={() => setCurrentPage("home")}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        {userType === "risikogeber" ? (
          <LandingPage
            onLogin={handleLogin}
            onUserTypeChange={handleUserTypeChange}
            onNavigate={(page) => {
              setCurrentPage(page as Page);
            }}
          />
        ) : (
          <RisktakerLandingPage
            onLogin={handleLogin}
            onUserTypeChange={handleUserTypeChange}
          />
        )}
      </ThemeProvider>
    );
  }

  // Calculate unread messages count
  const unreadMessagesCount = mockConversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#f8f8f8",
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar
            currentPage={currentPage as any}
            unreadMessages={unreadMessagesCount}
            onNavigate={(page) => setCurrentPage(page as Page)}
            onNewRisk={handleOpenRiskModal}
            onLogout={handleLogout}
          />
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: 280,
                boxSizing: "border-box",
              },
            }}
          >
            <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1400 }}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ color: "#4f4a4a" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: "100%" }}>
              <Sidebar
                currentPage={currentPage as any}
                unreadMessages={unreadMessagesCount}
                onNavigate={(page) => {
                  setCurrentPage(page as Page);
                  setMobileOpen(false);
                }}
                onNewRisk={() => {
                  handleOpenRiskModal();
                  setMobileOpen(false);
                }}
                onLogout={handleLogout}
              />
            </Box>
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            ml: { xs: 0, md: "280px" },
            width: {
              xs: "100%",
              md: "calc(100% - 280px)",
            },
          }}
        >
          {/* Mobile Logo Header */}
          {isMobile && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1200,
                bgcolor: "rgba(253, 252, 252, 0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid #e6e5e5",
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // Safe area inset for iOS devices
                "@supports (padding: max(0px))": {
                  paddingTop: "max(16px, env(safe-area-inset-top, 16px))",
                  paddingLeft: "max(24px, env(safe-area-inset-left, 24px))",
                  paddingRight: "max(24px, env(safe-area-inset-right, 24px))",
                },
              }}
            >
              <img
                src={imgImageXriskLogo}
                alt="RiskExchange"
                style={{ 
                  width: 55, 
                  height: 48, 
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentPage("home")}
              />
              
              {/* Menu Button */}
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  bgcolor: mobileOpen ? "#e05a1b" : "rgba(255, 103, 31, 0.95)",
                  color: "white",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    bgcolor: "#e05a1b",
                    transform: "scale(1.05)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {mobileOpen ? (
                  <CloseIcon sx={{ fontSize: 28 }} />
                ) : (
                  <MenuIcon sx={{ fontSize: 28 }} />
                )}
              </IconButton>
            </Box>
          )}

          {currentPage === "messages" ? (
            <Box sx={{ height: "100vh" }}>
              <Messages 
                onOpenRiskDetail={(riskId) => {
                  // Find the risk and open detail drawer
                  const risk = newRisks.find(r => r.id === riskId);
                  if (risk) {
                    handleRiskDetails(risk, 'own');
                  }
                }}
              />
            </Box>
          ) : currentPage === "account" ? (
            <Box
              sx={{
                bgcolor: "#fdfcfc",
                minHeight: "100vh",
                py: { xs: 2, md: 5 },
              }}
            >
              <AccountSettings onBack={() => setCurrentPage("home")} />
            </Box>
          ) : currentPage === "impressum" ? (
            <ImpressumPage onNavigateBack={() => setCurrentPage("home")} />
          ) : currentPage === "datenschutz" ? (
            <DatenschutzPage onNavigateBack={() => setCurrentPage("home")} />
          ) : currentPage === "agb" ? (
            <AGBPage onNavigateBack={() => setCurrentPage("home")} />
          ) : (
            <Container
              maxWidth={false}
              sx={{
                px: { xs: 2, sm: 3, md: 5 },
                py: { xs: 2, md: 5 },
                bgcolor: "#fdfcfc",
                minHeight: "100vh",
              }}
            >
              {currentPage === "home" && (
                <Dashboard
                  newRisks={newRisks}
                  onCreateRiskClick={handleOpenRiskModal}
                  onDeleteRisk={handleDeleteRisk}
                  onRiskDetails={handleRiskDetails}
                />
              )}
              {currentPage === "marketplace" && (
                <Marketplace
                  onRiskDetails={handleRiskDetails}
                  onTakeRisk={handleTakeRiskFromMarketplace}
                />
              )}
              {currentPage === "designsystem" && <DesignSystem />}
            </Container>
          )}
        </Box>
      </Box>

      {/* Risk Input Modal */}
      <RiskInputModal
        open={riskModalOpen}
        onClose={() => setRiskModalOpen(false)}
        initialRiskDescription=""
        onRiskCreated={handleRiskCreated}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
      />

      {/* Take Risk Modal */}
      {selectedRisk && (
        <TakeRiskModal
          open={takeRiskModalOpen}
          onClose={() => setTakeRiskModalOpen(false)}
          risk={selectedRisk}
        />
      )}

      {/* Risk Detail Dialog */}
      {selectedRisk && (
        <RiskDetailDialog
          open={riskDetailDialogOpen}
          onClose={handleCloseRiskDetailDialog}
          risk={selectedRisk}
          onTakeRisk={handleTakeRiskFromDetail}
          onUserClick={handleUserClick}
          context={riskDetailContext}
        />
      )}

      {/* User Profile Dialog */}
      {selectedUserId && (
        <UserProfileDialog
          open={userProfileDialogOpen}
          onClose={handleCloseUserProfileDialog}
          user={users[selectedUserId] || null}
        />
      )}
    </ThemeProvider>
  );
}