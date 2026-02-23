import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, callback) => {
      const timestamp = Date.now();
      const ext = extname(file.originalname);
      callback(null, `${timestamp}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, callback: any) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      return callback(new Error('Only image files are allowed'), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
