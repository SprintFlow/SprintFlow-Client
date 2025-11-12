import React from 'react';
import { Backdrop, Box, Fade } from '@mui/material';

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
        <svg
          viewBox="0 0 450 380"
          width="90"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <path
              id="canal"
              d="M380,50 
                 L120,50
                 C70,50 50,70 50,100
                 C50,130 70,150 120,150
                 L330,150
                 C380,150 400,170 400,200
                 C400,230 380,250 330,250
                 L120,250
                 C70,250 50,270 50,300
                 C50,330 70,350 120,350
                 L380,350"
            />
            
            <style>
              {`
                @keyframes flowPath {
                  0% {
                    offset-distance: 0%;
                  }
                  100% {
                    offset-distance: 100%;
                  }
                }
                
                .bolita1 {
                  offset-path: path('M380,50 L120,50 C70,50 50,70 50,100 C50,130 70,150 120,150 L330,150 C380,150 400,170 400,200 C400,230 380,250 330,250 L120,250 C70,250 50,270 50,300 C50,330 70,350 120,350 L380,350');
                  animation: flowPath 8s linear infinite;
                }
                
                .bolita2 {
                  offset-path: path('M380,50 L120,50 C70,50 50,70 50,100 C50,130 70,150 120,150 L330,150 C380,150 400,170 400,200 C400,230 380,250 330,250 L120,250 C70,250 50,270 50,300 C50,330 70,350 120,350 L380,350');
                  animation: flowPath 8s linear infinite;
                  animation-delay: 2.5s;
                }
                
                .bolita3 {
                  offset-path: path('M380,50 L120,50 C70,50 50,70 50,100 C50,130 70,150 120,150 L330,150 C380,150 400,170 400,200 C400,230 380,250 330,250 L120,250 C70,250 50,270 50,300 C50,330 70,350 120,350 L380,350');
                  animation: flowPath 8s linear infinite;
                  animation-delay: 5s;
                }
              `}
            </style>
          </defs>

          <path
            d="M380,50 
               L120,50
               C70,50 50,70 50,100
               C50,130 70,150 120,150
               L330,150
               C380,150 400,170 400,200
               C400,230 380,250 330,250
               L120,250
               C70,250 50,270 50,300
               C50,330 70,350 120,350
               L380,350"
            stroke="white"
            strokeWidth="45"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <use href="#canal" stroke="#8cc8b5" strokeWidth="35" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          <circle className="bolita1" r="13" fill="#fbbf24" />
          <circle className="bolita2" r="13" fill="#fbbf24" />
          <circle className="bolita3" r="13" fill="#fbbf24" />

          <text
            x="225"
            y="210"
            textAnchor="middle"
            fontWeight="600"
            fontSize="38"
            fill="#1f2937"
            fontFamily="Arial, sans-serif"
          >
            SprintFlow
          </text>
        </svg>
      </Box>
    </Backdrop>
  );
}