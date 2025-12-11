import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  InputBase,
  Paper,
  Avatar,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Send as SendIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { mockConversations, mockMessages } from "../lib/messages-mock-data";
import { Conversation, Message } from "../types/message";
import { currentUser } from "../lib/current-user";
import { users } from "../lib/user-mock-data";
import { VerifiedBadge } from "./VerifiedBadge";

interface MessagesProps {
  onOpenRiskDetail?: (riskId: string) => void;
}

export function Messages({ onOpenRiskDetail }: MessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Jetzt";
    if (minutes < 60) return `${minutes} Min`;
    if (hours < 24) return `${hours} Std`;
    if (days < 7) return `${days}T`;
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      senderAvatar: currentUser.avatar,
      senderVerified: true,
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.riskTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mobile: Show either list or chat
  const showList = !isMobile || !selectedConversation;
  const showChat = !isMobile || selectedConversation;

  return (
    <Box sx={{ display: "flex", height: "100%", bgcolor: "#fdfcfc", position: "relative" }}>
      {/* Conversations List */}
      <Box
        sx={{
          width: { xs: "100%", md: 360 },
          borderRight: { xs: "none", md: "1px solid #e6e5e5" },
          display: showList ? "flex" : "none",
          flexDirection: "column",
          bgcolor: "white",
          position: { xs: "absolute", md: "relative" },
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: { xs: selectedConversation ? 0 : 2, md: 1 },
        }}
      >
        {/* Search Header */}
        <Box sx={{ p: { xs: 2, md: 2 }, pt: { xs: isMobile ? 8 : 2, md: 2 } }}>
          <h2 className="heading-3" style={{ marginBottom: "16px" }}>
            Nachrichten
          </h2>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: { xs: 1.5, md: 1.25 },
              bgcolor: "#f5f5f5",
              borderRadius: "12px",
              border: "1px solid transparent",
              transition: "all 0.2s ease",
              "&:focus-within": {
                borderColor: "#ff671f",
                bgcolor: "white",
              },
            }}
          >
            <SearchIcon sx={{ fontSize: { xs: 22, md: 20 }, color: "#9e9e9e" }} />
            <InputBase
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "16px", md: "14px" },
                "& input::placeholder": {
                  color: "#9e9e9e",
                  opacity: 1,
                },
              }}
            />
          </Paper>
        </Box>

        {/* Conversations List */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?.id === conversation.id;
            const partnerUser = users[conversation.partnerId];

            return (
              <Box
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                sx={{
                  px: 2,
                  py: { xs: 2, md: 1.75 },
                  cursor: "pointer",
                  bgcolor: isSelected ? "rgba(255, 103, 31, 0.06)" : "transparent",
                  borderLeft: isSelected ? "3px solid #ff671f" : "3px solid transparent",
                  transition: "all 0.15s ease",
                  "&:active": {
                    bgcolor: "rgba(255, 103, 31, 0.12)",
                  },
                  "&:hover": {
                    bgcolor: isSelected ? "rgba(255, 103, 31, 0.06)" : "#f5f5f5",
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: { xs: 1.5, md: 1.25 }, alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={conversation.partnerAvatar}
                      sx={{ width: { xs: 56, md: 48 }, height: { xs: 56, md: 48 } }}
                    />
                    {conversation.unreadCount > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          minWidth: { xs: 22, md: 20 },
                          height: { xs: 22, md: 20 },
                          px: 0.5,
                          bgcolor: "#ff671f",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "2px solid white",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "11px", md: "10px" },
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {conversation.unreadCount}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Name & Time */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "16px", md: "14px" },
                            fontWeight: 600,
                            color: "#353131",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {conversation.partnerName}
                        </Typography>
                        {partnerUser?.verification.hasVerifiedEmail &&
                          partnerUser?.verification.hasVerifiedPhone && (
                            <Box sx={{ flexShrink: 0 }}>
                              <VerifiedBadge size="small" />
                            </Box>
                          )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "12px", md: "11px" },
                          color: "#9e9e9e",
                          whiteSpace: "nowrap",
                          ml: 1,
                        }}
                      >
                        {formatDate(conversation.lastMessageTime)}
                      </Typography>
                    </Box>

                    {/* Risk Title */}
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", md: "12px" },
                        fontWeight: 500,
                        color: "#757575",
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {conversation.riskTitle}
                    </Typography>

                    {/* Last Message */}
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "13px" },
                        color: conversation.unreadCount > 0 ? "#353131" : "#9e9e9e",
                        fontWeight: conversation.unreadCount > 0 ? 500 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {conversation.lastMessage}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Chat Area */}
      <Fade in={showChat} timeout={200}>
        <Box
          sx={{
            flex: 1,
            display: showChat ? "flex" : "none",
            flexDirection: "column",
            position: { xs: "absolute", md: "relative" },
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: { xs: selectedConversation ? 3 : 0, md: 1 },
            bgcolor: "#fdfcfc",
          }}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <Box
                sx={{
                  p: { xs: 2, md: 2 },
                  pt: { xs: isMobile ? 8 : 2, md: 2 },
                  borderBottom: "1px solid #e6e5e5",
                  bgcolor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 }, flex: 1, minWidth: 0 }}>
                  {/* Back Button (Mobile only) */}
                  {isMobile && (
                    <IconButton
                      onClick={handleBackToList}
                      sx={{
                        color: "#353131",
                        p: 1,
                      }}
                    >
                      <ArrowBackIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                  )}

                  <Avatar
                    src={selectedConversation.partnerAvatar}
                    sx={{ width: { xs: 44, md: 40 }, height: { xs: 44, md: 40 } }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "17px", md: "16px" },
                          fontWeight: 600,
                          color: "#353131",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedConversation.partnerName}
                      </Typography>
                      {users[selectedConversation.partnerId]?.verification.hasVerifiedEmail &&
                        users[selectedConversation.partnerId]?.verification.hasVerifiedPhone && (
                          <Box sx={{ flexShrink: 0 }}>
                            <VerifiedBadge size="small" />
                          </Box>
                        )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", md: "12px" },
                        color: "#757575",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedConversation.riskTitle}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onOpenRiskDetail?.(selectedConversation.riskId)}
                    sx={{
                      borderColor: "#e6e5e5",
                      color: "#353131",
                      textTransform: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "13px", md: "13px" },
                      fontWeight: 600,
                      px: { xs: 1.5, md: 2 },
                      py: 1,
                      borderRadius: "8px",
                      minWidth: { xs: "auto", md: "auto" },
                      "&:hover": {
                        borderColor: "#ff671f",
                        bgcolor: "rgba(255, 103, 31, 0.04)",
                      },
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 16, mr: { xs: 0, md: 0.5 } }} />
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                      Anliegen
                    </Box>
                  </Button>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  p: { xs: 2, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 2.5, md: 3 },
                }}
              >
                {messages.map((message) => {
                  const isCurrentUser = message.senderId === currentUser.id;
                  const isSystem = message.isSystemMessage;

                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        gap: { xs: 1.25, md: 1.5 },
                        alignItems: "flex-start",
                        flexDirection: isCurrentUser && !isSystem ? "row-reverse" : "row",
                      }}
                    >
                      {/* Avatar */}
                      <Avatar
                        src={message.senderAvatar}
                        sx={{
                          width: { xs: 36, md: 32 },
                          height: { xs: 36, md: 32 },
                          bgcolor: isSystem ? "#ff671f" : "#e0e0e0",
                          flexShrink: 0,
                        }}
                      >
                        {isSystem && <InfoIcon sx={{ fontSize: { xs: 20, md: 18 } }} />}
                      </Avatar>

                      {/* Message Content */}
                      <Box
                        sx={{
                          maxWidth: { xs: "75%", md: "65%" },
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          alignItems: isCurrentUser && !isSystem ? "flex-end" : "flex-start",
                        }}
                      >
                        {/* Sender & Time */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: "13px", md: "12px" },
                              fontWeight: 600,
                              color: "#757575",
                            }}
                          >
                            {message.senderName}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", md: "11px" },
                              color: "#9e9e9e",
                            }}
                          >
                            {formatDate(message.timestamp)}
                          </Typography>
                        </Box>

                        {/* Message Bubble */}
                        <Paper
                          elevation={0}
                          sx={{
                            px: { xs: 2, md: 2 },
                            py: { xs: 1.75, md: 1.5 },
                            bgcolor: isCurrentUser && !isSystem
                              ? "#ff671f"
                              : isSystem
                              ? "rgba(255, 103, 31, 0.08)"
                              : "white",
                            border: isSystem
                              ? "1px solid rgba(255, 103, 31, 0.2)"
                              : isCurrentUser && !isSystem
                              ? "none"
                              : "1px solid #e6e5e5",
                            borderRadius: "16px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: "15px", md: "14px" },
                              color: isCurrentUser && !isSystem ? "white" : "#353131",
                              lineHeight: 1.5,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {message.content}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box
                sx={{
                  p: { xs: 2, md: 2 },
                  pb: { xs: 2, md: 2 },
                  borderTop: "1px solid #e6e5e5",
                  bgcolor: "white",
                  // Safe area inset for iOS notch
                  paddingBottom: { xs: "max(16px, env(safe-area-inset-bottom))", md: 2 },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: { xs: 1.25, md: 1.5 },
                    px: { xs: 2, md: 2 },
                    py: { xs: 1.25, md: 1.5 },
                    bgcolor: "#f5f5f5",
                    borderRadius: "16px",
                    border: "1px solid transparent",
                    transition: "all 0.2s ease",
                    "&:focus-within": {
                      borderColor: "#ff671f",
                      bgcolor: "white",
                    },
                  }}
                >
                  <InputBase
                    multiline
                    maxRows={4}
                    placeholder="Nachricht..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                      flex: 1,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "16px", md: "14px" },
                      "& input::placeholder, & textarea::placeholder": {
                        color: "#9e9e9e",
                        opacity: 1,
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      bgcolor: newMessage.trim() ? "#ff671f" : "#e6e5e5",
                      color: "white",
                      width: { xs: 40, md: 36 },
                      height: { xs: 40, md: 36 },
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: newMessage.trim() ? "#e65a1a" : "#e6e5e5",
                      },
                      "&:disabled": {
                        bgcolor: "#e6e5e5",
                        color: "#9e9e9e",
                      },
                      "&:active": {
                        transform: newMessage.trim() ? "scale(0.95)" : "none",
                      },
                    }}
                  >
                    <SendIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Paper>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <InfoIcon sx={{ fontSize: 64, color: "#e6e5e5" }} />
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#9e9e9e",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Wähle eine Unterhaltung
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
}