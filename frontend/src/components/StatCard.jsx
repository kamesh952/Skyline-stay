import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  borderRadius: '12px',
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '50%',
  background: color,
  color: 'white',
  marginRight: theme.spacing(2),
  display: 'flex',
}));

export default function StatCard({ icon, title, value, color }) {
  return (
    <StyledPaper elevation={0}>
      <IconWrapper color={color}>{icon}</IconWrapper>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </StyledPaper>
  );
}