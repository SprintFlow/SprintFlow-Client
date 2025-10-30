import React from 'react';
import { Backdrop, Box, Fade } from '@mui/material';
import SprintFlowLogo from './SprintFlowLogo';

export default function LoadingOverlay({ open }) {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={open}
      slots={{ transition: Fade }}
      slotProps={{ transition: { unmountOnExit: true } }}
      data-testid="loading-overlay"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SprintFlowLogo width={300} />
      </Box>
    </Backdrop>
  );
}
