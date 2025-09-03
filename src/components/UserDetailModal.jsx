// src/components/UserDetailModal.js
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  Stack,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const UserDetailModal = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={user.profile.profile_image}
              sx={{ width: 90, height: 90, border: '3px solid #eee' }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {`${user.profile.first_name} ${user.profile.last_name}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Chip
              label={user.status}
              color={user.status === 'active' ? 'success' : 'default'}
              size="small"
              sx={{ mt: 1, fontWeight: 500 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Profile Details */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          Profile Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <b>DOB:</b> {user.profile.date_of_birth}
            </Typography>
            <Typography variant="body2">
              <b>Location:</b> {`${user.profile.city}, ${user.profile.state}`}
            </Typography>
            <Typography variant="body2">
              <b>Experience:</b> {user.profile.years_of_experience} years
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <b>Availability:</b> {user.profile.availability}
            </Typography>
            <Typography variant="body2">
              <b>Headshot:</b> {user.profile.professional_headshot}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Interests */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          Interests
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {user.interests.categories.map((cat) => (
            <Chip
              key={`cat-${cat.id}`}
              label={cat.name}
              variant="outlined"
              color="primary"
            />
          ))}
          {user.interests.keywords.map((key) => (
            <Chip
              key={`key-${key.id}`}
              label={key.name}
              variant="outlined"
              color="secondary"
            />
          ))}
        </Stack>
      </Box>
    </Modal>
  );
};

export default UserDetailModal;
