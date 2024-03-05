"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorValidationFields = void 0;
class ApiErrorValidationFields extends Error {
    constructor(message, statusCode, fieldError) {
        super(message);
        this.statusCode = statusCode;
        this.fieldError = fieldError;
    }
}
exports.ApiErrorValidationFields = ApiErrorValidationFields;
