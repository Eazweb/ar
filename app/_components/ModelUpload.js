'use client'
import React, { useState } from 'react';

const ModelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('model', file);

    try {
      const response = await fetch('/api/uploadmodel', {
        method: 'POST',
        body: formData,
        headers: {
          // No need to set Content-Type, as it will be set automatically
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setModelUrl(data.modelUrl); // Set the returned model URL
    } catch (error) {
      console.error('Error uploading model:', error);
    }
  };

  const handleProgress = (event) => {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      setUploadProgress(percent);
    }
  };

  return (
    <div>
      <h1>Upload 3D Model</h1>
      <input type="file" accept=".glb,.gltf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Model</button>
      {uploadProgress > 0 && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{Math.round(uploadProgress)}%</span>
        </div>
      )}
      {modelUrl && (
        <div>
          <h2>Model URL:</h2>
          <p>{modelUrl}</p>
        </div>
      )}
    </div>
  );
};

export default ModelUpload;
