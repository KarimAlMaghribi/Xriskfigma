import { Avatar, Box, Card, CardContent, CardHeader, Rating, Stack, Typography, Button } from "@mui/material";
import { COLORS } from "../../lib/constants";

interface OfferCardProps {
  offerId: string;
  userName: string;
  userAvatar?: string;
  userRating: number;
  premium: number;
  message?: string;
  onAccept?: (offerId: string) => void;
  onMaybe?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
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
    <Card variant="outlined" sx={{ borderRadius: 2, borderColor: COLORS.neutral.border }}>
      <CardHeader
        avatar={<Avatar src={userAvatar}>{userName[0]}</Avatar>}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {userName}
            </Typography>
            <Rating value={userRating} precision={0.5} readOnly size="small" />
          </Stack>
        }
        subheader={`Prämie: ${premium} €`}
        subheaderTypographyProps={{ sx: { color: COLORS.brand.primary, fontWeight: 600 } }}
      />
      <CardContent sx={{ pt: 0 }}>
        {message ? (
          <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 2 }}>
            {message}
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: COLORS.brand.primary, color: "#fff", textTransform: "none" }}
            onClick={() => onAccept?.(offerId)}
          >
            Annehmen
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", borderColor: COLORS.neutral.gray, color: COLORS.text.primary }}
            onClick={() => onMaybe?.(offerId)}
          >
            Vielleicht
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: "none", color: "#f54900" }}
            onClick={() => onReject?.(offerId)}
          >
            Ablehnen
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
