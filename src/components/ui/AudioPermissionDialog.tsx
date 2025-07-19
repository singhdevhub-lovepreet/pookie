import React, { useState } from 'react';
import './AudioPermissionDialog.css';

interface AudioPermissionDialogProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

export const AudioPermissionDialog: React.FC<AudioPermissionDialogProps> = ({
  onPermissionGranted,
  onPermissionDenied
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAudioPermission = async () => {
    setIsRequesting(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      // Permission granted, stop the stream since we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      onPermissionGranted();
    } catch (err) {
      console.error('Audio permission denied:', err);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Microphone access was denied. You need to allow microphone access to speak in the game.');
        } else {
          setError(`Error accessing microphone: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred while requesting microphone access.');
      }
      
      setIsRequesting(false);
    }
  };

  const handleAllow = () => {
    requestAudioPermission();
  };

  const handleDeny = () => {
    onPermissionDenied();
  };

  return (
    <div className="audio-permission-dialog-overlay">
      <div className="audio-permission-dialog">
        <h2>Microphone Access</h2>
        
        <div className="dialog-content">
          <p>
            This game requires microphone access to enable voice chat with other players.
            Would you like to allow access to your microphone?
          </p>
          
          {error && (
            <div className="error-message">
              {error}
              <p>You can still play, but won't be able to use voice chat.</p>
            </div>
          )}
        </div>
        
        <div className="dialog-actions">
          <button 
            className="deny-button" 
            onClick={handleDeny}
            disabled={isRequesting}
          >
            No Thanks
          </button>
          
          <button 
            className="allow-button" 
            onClick={handleAllow}
            disabled={isRequesting}
          >
            {isRequesting ? 'Requesting...' : 'Allow Microphone'}
          </button>
        </div>
        
        <div className="dialog-note">
          <p>
            <small>
              You can change this permission later in your browser settings.
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};