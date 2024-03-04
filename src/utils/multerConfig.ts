import multer from "multer";
import { ApiErrorValidationFields } from "./ApiError";
import { Request } from "express";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 } from "uuid";

interface FileFilterCallback {
  (error: Error | null, acceptFile?: boolean): void;
}

const s3Config = new S3Client({
  region: process.env.AWS_DEFAULT_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const storageS3 = {
  s3: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      const generateRandomId = v4();
      cb(null, `${generateRandomId}-${file.originalname}`);
    },
  }),
};


export const multerConfig = {
  dest: "./tmp/uploads",
  storage: storageS3.s3,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      callback(new ApiErrorValidationFields("Tipo de arquivo inválido.", 400));
    }
    callback(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
};
