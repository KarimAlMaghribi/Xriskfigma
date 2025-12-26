import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Star } from "lucide-react";

interface UserAvatarWithRatingProps {
  avatar?: string;
  name: string;
  rating: number;
  size?: "small" | "medium";
}

export function UserAvatarWithRating({ avatar, name, rating, size = "medium" }: UserAvatarWithRatingProps) {
  const dimension = size === "small" ? 32 : 40;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar src={avatar} sx={{ width: dimension, height: dimension }}>
        {name.charAt(0)}
      </Avatar>
      <Box>
        <Typography sx={{ fontWeight: 600, fontSize: size === "small" ? 14 : 16 }}>{name}</Typography>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#f59e0b" }}>
          <Star size={14} />
          <Typography sx={{ fontSize: 12 }}>{rating.toFixed(1)}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
