import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";

interface UserAvatarWithRatingProps {
  avatar?: string;
  name: string;
  rating: number;
  size?: "small" | "medium";
}

export function UserAvatarWithRating({ avatar, name, rating, size = "medium" }: UserAvatarWithRatingProps) {
  const avatarSize = size === "small" ? 32 : 40;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar src={avatar} alt={name} sx={{ width: avatarSize, height: avatarSize }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
        <Rating value={rating} precision={0.5} readOnly size="small" />
      </Box>
    </Stack>
  );
}
