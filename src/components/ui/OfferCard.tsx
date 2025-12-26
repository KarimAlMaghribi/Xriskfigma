import { Avatar, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Star } from "lucide-react";

interface OfferCardProps {
  offerId: string;
  userName: string;
  userAvatar?: string;
  userRating: number;
  premium: number;
  message: string;
  onAccept: (offerId: string) => void;
  onMaybe: (offerId: string) => void;
  onReject: (offerId: string) => void;
}

export function OfferCard({
  offerId,
  userName,
  userAvatar,
  userRating,
  premium,
  message,
  onAccept,
  onMaybe,
  onReject,
}: OfferCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Avatar src={userAvatar}>{userName.charAt(0)}</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>{userName}</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#f59e0b" }}>
              <Star size={16} />
              <Typography sx={{ fontSize: 14 }}>{userRating.toFixed(1)}</Typography>
            </Stack>
          </Box>
          <Typography sx={{ fontWeight: 700 }}>{premium.toLocaleString("de-DE")} €</Typography>
        </Stack>
        <Typography sx={{ color: "#4f4a4a", mb: 2 }}>{message}</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button variant="contained" onClick={() => onAccept(offerId)}>
            Annehmen
          </Button>
          <Button variant="outlined" onClick={() => onMaybe(offerId)}>
            Vielleicht später
          </Button>
          <Button variant="text" color="error" onClick={() => onReject(offerId)}>
            Ablehnen
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
