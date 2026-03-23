import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { CameraAlt, Refresh, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { biometricEngineService } from '../../auto-verification/services/biometric-engine.service';
import { FaceCaptureInput } from '../../../domain-kernel/src/types';

interface FaceCaptureCameraProps {
  onCapture: (capture: FaceCaptureInput) => void;
  onError?: (error: string) => void;
  maxAttempts?: number;
  showLivenessIndicator?: boolean;
}

type CaptureState = 'idle' | 'initializing' | 'ready' | 'capturing' | 'processing' | 'success' | 'failed';

export const FaceCaptureCamera: React.FC<FaceCaptureCameraProps> = ({
  onCapture,
  onError,
  maxAttempts = 3,
  showLivenessIndicator = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [state, setState] = useState<CaptureState>('idle');
  const [attempts, setAttempts] = useState(0);
  const [livenessScore, setLivenessScore] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    initializeCamera();
    
    biometricEngineService.loadModels()
      .then(() => setIsModelLoaded(true))
      .catch(console.error);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    setState('initializing');
    setErrorMessage('');

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setState('ready');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to access camera';
      setErrorMessage(message);
      setState('failed');
      onError?.(message);
    }
  };

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || state !== 'ready') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setState('capturing');

    setTimeout(async () => {
      setState('processing');
      
      try {
        const liveness = await biometricEngineService.checkLiveness(canvas);
        setLivenessScore(liveness);

        if (liveness < 0.7) {
          throw new Error('Liveness check failed. Please ensure you are a real person.');
        }

        const capture = await biometricEngineService.captureFace(canvas);
        
        setState('success');
        setAttempts(prev => prev + 1);
        onCapture(capture);
      } catch (error) {
        setState('failed');
        const message = error instanceof Error ? error.message : 'Capture failed';
        setErrorMessage(message);
        onError?.(message);
        setAttempts(prev => prev + 1);
      }
    }, 500);
  }, [state, onCapture, onError]);

  const resetCapture = () => {
    setState('ready');
    setErrorMessage('');
    setLivenessScore(0);
  };

  const getStateDisplay = () => {
    switch (state) {
      case 'initializing':
        return { text: 'Initializing camera...', color: 'info' };
      case 'ready':
        return { text: 'Position your face in the frame', color: 'primary' };
      case 'capturing':
        return { text: 'Capturing...', color: 'warning' };
      case 'processing':
        return { text: 'Processing...', color: 'info' };
      case 'success':
        return { text: 'Capture successful!', color: 'success' };
      case 'failed':
        return { text: errorMessage || 'Capture failed', color: 'error' };
      default:
        return { text: '', color: 'default' };
    }
  };

  const display = getStateDisplay();
  const canRetry = attempts < maxAttempts;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        maxWidth: 480, 
        mx: 'auto',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4/3',
            bgcolor: 'black',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: state === 'idle' || state === 'initializing' ? 'none' : 'block'
            }}
            playsInline
            muted
          />
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <AnimatePresence>
            {state === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,255,0,0.2)'
                }}
              >
                <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
              </motion.div>
            )}
          </AnimatePresence>

          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              aspectRatio: '1',
              border: '3px solid',
              borderColor: state === 'ready' ? 'primary.main' : 'transparent',
              borderRadius: '50%',
              pointerEvents: 'none',
              transition: 'border-color 0.3s'
            }}
          />
        </Box>

        {showLivenessIndicator && livenessScore > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Liveness Score: {Math.round(livenessScore * 100)}%
            </Typography>
            <CircularProgress
              variant="determinate"
              value={livenessScore * 100}
              size={24}
              sx={{ ml: 1 }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography 
          variant="body1" 
          color={`${display.color}.main`}
          sx={{ mb: 1 }}
        >
          {display.text}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          Attempt {attempts + 1} of {maxAttempts}
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {state === 'ready' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraAlt />}
            onClick={captureFrame}
            disabled={!isModelLoaded}
          >
            Capture
          </Button>
        )}

        {(state === 'failed' || state === 'success') && canRetry && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Refresh />}
            onClick={resetCapture}
          >
            Try Again
          </Button>
        )}

        {state === 'processing' && (
          <CircularProgress size={24} />
        )}
      </Box>
    </Paper>
  );
};

export default FaceCaptureCamera;
