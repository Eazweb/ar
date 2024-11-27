'use client'
import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer/dist/model-viewer.js';

const ModelViewer = ({ 
  modelUrl, 
  posterUrl, 
  name = '3D Model' 
}) => {
  const modelViewerRef = useRef(null);
  const [isArSupported, setIsArSupported] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [viewMode, setViewMode] = useState('3d'); // 'ar' or '3d'

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    
    const handleLoad = () => {
      console.log('Model loaded successfully');
    };

    const handleError = (event) => {
      console.error('Model loading error:', event);
    };

    const handleProgress = (event) => {
      const progressBar = event.detail.totalProgress * 100;
      setLoadingProgress(progressBar);
    };

    // Check AR support
    const checkArSupport = () => {
      if (modelViewer) {
        setIsArSupported(modelViewer.canActivateAR);
      }
    };
    
    // Add event listeners
    if (modelViewer) {
      modelViewer.addEventListener('load', handleLoad);
      modelViewer.addEventListener('error', handleError);
      modelViewer.addEventListener('progress', handleProgress);
      
      // Check AR support when component mounts
      checkArSupport();
    }

    // Cleanup function
    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('load', handleLoad);
        modelViewer.removeEventListener('error', handleError);
        modelViewer.removeEventListener('progress', handleProgress);
      }
    };
  }, [modelUrl]);

  // Toggle between 3D and AR modes
  const handleViewModeToggle = () => {
    setViewMode(prevMode => prevMode === '3d' ? 'ar' : '3d');
  };

  return (
    <div className="relative w-[90%] h-screen mx-auto">
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/80 rounded-full p-1 flex items-center">
        <button
          onClick={handleViewModeToggle}
          className={`px-4 py-2 rounded-full transition-colors ${
            viewMode === '3d' 
              ? 'bg-blue-500 text-white' 
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
          }`}
        >
          3D
        </button>
        <button
          onClick={handleViewModeToggle}
          className={`px-4 py-2 rounded-full transition-colors ${
            viewMode === 'ar' 
              ? 'bg-blue-500 text-white' 
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
          }`}
        >
          AR
        </button>
      </div>

      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        
        // AR Specific Attributes
        ar={viewMode === 'ar'}
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        camera-controls
        
        // Rendering and Performance
        tone-mapping="neutral"
        poster={posterUrl || ''}
        shadow-intensity="1"
        
        // Accessibility and Style
        alt={`3D model of ${name}`}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          backgroundColor: '#f0f0f0'
        }}
      >
        {/* Loading Progress Bar */}
        <div slot="progress-bar" className={`progress-bar ${loadingProgress === 100 ? 'hide' : ''}`}>
          <div 
            className="update-bar" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        {/* AR Button with Conditional Rendering */}
        {isArSupported && viewMode === 'ar' && (
          <button 
            slot="ar-button" 
            className="ar-button bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View in Your Space
          </button>
        )}

        {/* Fallback Content for Non-AR Devices */}
        <div slot="no-ar" className="text-center p-4">
          <p>AR not supported on this device</p>
        </div>
      </model-viewer>

      {/* Additional Loading Overlay */}
      {loadingProgress < 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-lg">
            Loading Model: {Math.round(loadingProgress)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;