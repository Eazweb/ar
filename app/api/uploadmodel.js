import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import formidable from 'formidable';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// Disable body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handle file upload
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });

  try {
    const parsedData = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = parsedData.files.model;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.filepath, 
        { 
          folder: 'models',
          resource_type: 'raw' // Important for .glb files
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Optional: Delete local file
    await fs.unlink(file.filepath);

    // Return Cloudinary URL
    res.status(200).json({ modelUrl: result.secure_url });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
}