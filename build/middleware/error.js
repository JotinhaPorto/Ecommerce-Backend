"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const multer_1 = require("multer");
const errorMiddleware = (error, req, res, next) => {
    var _a;
    console.log(error);
    const ErrorsFromMulter = {
        LIMIT_FILE_SIZE: "Selecione um arquivo menor que 2MB.",
        LIMIT_UNEXPECTED_FILE: "Selecione apenas um arquivo.",
        LIMIT_PART_COUNT: "Selecione apenas um arquivo.",
        LIMIT_FILE_COUNT: "Selecione apenas um arquivo.",
        LIMIT_FIELD_KEY: "Selecione apenas um arquivo.",
        LIMIT_FIELD_VALUE: "Limite de valor do campo excedido.",
        LIMIT_FIELD_COUNT: "Limite de campos excedido.",
    };
    if (error instanceof multer_1.MulterError) {
        error.message = ErrorsFromMulter[error.code] || error.message;
        return res.status(400).json({ message: error.message });
    }
    const statusCode = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    const message = error.statusCode ? error.message : "Internal Server Error";
    const fieldError = error.fieldError;
    return res.status(statusCode).json({ message, fieldError });
};
exports.errorMiddleware = errorMiddleware;
