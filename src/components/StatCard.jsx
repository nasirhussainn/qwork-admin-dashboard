// src/components/StatCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left content */}
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              {value}
            </Typography>
          </Box>

          {/* Right icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => theme.palette[color].light,
              color: (theme) => theme.palette[color].main,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
