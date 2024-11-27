'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import { AES, enc } from 'crypto-js'; // Import AES and the encoding module
import ModelViewer from '@/_components/ModelViewer';

const ModelPage = () => {
  const { id } = useParams(); // Get the id directly from the URL parameters
  const [modelUrl, setModelUrl] = useState('');

  useEffect(() => {
    if (!id) return; // If the id is not available, do nothing.

    try {
      // Decode the URL before decrypting
      const decodedUrl = decodeURIComponent(id);
      // Decrypt the URL
      const decryptedUrl = AES.decrypt(decodedUrl, 'secret-key').toString(enc.Utf8); // Use enc.Utf8 from the imported enc module
      setModelUrl(decryptedUrl); // Set the decrypted URL to state
      console.log(decryptedUrl); // Log the decrypted URL for debugging
    } catch (error) {
      console.error('Error decoding model link:', error);
    }
  }, [id]); // The useEffect will run when `id` changes (i.e., when the page is loaded).

  return (
    <div className='h-screen w-full'>
      {modelUrl && <ModelViewer modelUrl={modelUrl} />}
    </div>
  );
};

export default ModelPage;
