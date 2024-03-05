"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const ApiError_1 = require("./ApiError");
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3Config = new client_s3_1.S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const storageS3 = {
    s3: (0, multer_s3_1.default)({
        s3: s3Config,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, cb) => {
            const generateRandomId = (0, uuid_1.v4)();
            cb(null, `${generateRandomId}-${file.originalname}`);
        },
    }),
};
exports.multerConfig = {
    dest: "./tmp/uploads",
    storage: storageS3.s3,
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif",
        ];
        if (!allowedMimes.includes(file.mimetype)) {
            callback(new ApiError_1.ApiErrorValidationFields("Tipo de arquivo inválido.", 400));
        }
        callback(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
};
