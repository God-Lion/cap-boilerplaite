// modules/biometric-capture/components/FaceCapture.tsx
import React, { useRef, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import Webcam from 'react-webcam';

export function FaceCapture({ onCapture }: { onCapture: (image: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturing(true);
      setTimeout(() => {
        onCapture(imageSrc);
        setCapturing(false);
      }, 1000);
    }
  }, [webcamRef, onCapture]);

  return (
    <Box textAlign="center">
      <Typography variant="h6" gutterBottom>Face Capture</Typography>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%', borderRadius: '8px' }}
        />
        {capturing && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '8px' }}>
            <CircularProgress color="inherit" />
          </Box>
        )}
      </Box>
      <Button 
        variant="contained" 
        onClick={capture} 
        sx={{ mt: 2 }}
        disabled={capturing}
      >
        Capture Photo
      </Button>
    </Box>
  );
}
