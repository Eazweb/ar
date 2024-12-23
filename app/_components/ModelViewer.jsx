'use client'
import React, { useEffect, useRef, useState } from 'react'
import '@google/model-viewer/dist/model-viewer.js'

const ModelViewer = ({ modelUrl, posterUrl, name = '3D Model', modelWidth = 0 }) => {
  const modelViewerRef = useRef(null)
  const [isArSupported, setIsArSupported] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [arScale, setArScale] = useState(1)

  useEffect(() => {
    const modelViewer = modelViewerRef.current

    const handleLoad = () => {
      console.log('Model loaded successfully')
      updateArScale()
    }

    const handleError = (event) => {
      console.error('Model loading error:', event)
    }

    const handleProgress = (event) => {
      const progressBar = event.detail.totalProgress * 100
      setLoadingProgress(progressBar)
    }

    const updateArScale = () => {
      if (modelViewer && modelWidth > 0) {
        //Get the bounding box dimensions when the model loads to calculate aspect ratio
        modelViewer.updateBoundingBox()
        const boundingBox = modelViewer.getBoundingBox()
        const modelWidthInMeters = modelWidth / 1000
        const modelWidthScale = modelWidthInMeters / (boundingBox.max.x - boundingBox.min.x)

        //Scale according to the width, preserving aspect ratio
        setArScale(modelWidthScale)
        console.log('model Width is:', modelWidth)
        console.log('scaled width is:', modelWidthInMeters)
        console.log('Bounding Box X:', boundingBox.max.x - boundingBox.min.x)
        console.log('ArScale', modelWidthScale)
      }
    }

    // Check AR support
    const checkArSupport = () => {
      if (modelViewer) {
        setIsArSupported(modelViewer.canActivateAR)
      }
    }

    if (modelViewer) {
      modelViewer.addEventListener('load', handleLoad)
      modelViewer.addEventListener('error', handleError)
      modelViewer.addEventListener('progress', handleProgress)

      // Check AR support when component mounts
      checkArSupport()
    }

    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('load', handleLoad)
        modelViewer.removeEventListener('error', handleError)
        modelViewer.removeEventListener('progress', handleProgress)
      }
    }
  }, [modelUrl, modelWidth])

  return (
    <div className='relative w-[90%] h-screen mx-auto mt-3 rounded-lg'>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        // AR Specific Attributes
        ar
        ar-modes='webxr scene-viewer quick-look'
        ar-scale={arScale}
        camera-controls
        // Rendering and Performance
        tone-mapping='neutral'
        poster={posterUrl || ''}
        shadow-intensity='1'
        // Accessibility and Style
        alt={`3D model of ${name}`}
        style={{
          width: '100%',
          height: '90%',
          maxWidth: '100%',
          backgroundColor: '#f0f0f0',
        }}
      >
        {/* Loading Progress Bar */}
        <div slot='progress-bar' className={`progress-bar ${loadingProgress === 100 ? 'hide' : ''}`}>
          <div className='update-bar' style={{ width: `${loadingProgress}%` }}></div>
        </div>

        {/* Fallback Content for Non-AR Devices */}
        <div slot='no-ar' className='text-center p-4'>
          <p>AR not supported on this device</p>
        </div>
      </model-viewer>

      {/* Additional Loading Overlay */}
      {loadingProgress < 100 && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
          <div className='text-white text-lg'>Loading Model: {Math.round(loadingProgress)}%</div>
        </div>
      )}
    </div>
  )
}

export default ModelViewer
