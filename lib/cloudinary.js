import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'node:path';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadMiddleware(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`;
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = crypto.randomUUID();

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
        resource_type: 'auto',
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // keep file size < 5 MB
    },
  });
}

const upload = uploadMiddleware('file_uploader');

export default upload;
