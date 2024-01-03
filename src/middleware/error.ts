import { NextFunction, Request, Response } from 'express'
import { ApiErrorValidationFields } from '../utils/ApiError'

export const errorMiddleware = (
	error: Error & Partial<ApiErrorValidationFields>,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = error.statusCode ?? 500
	const message = error.statusCode ? error.message : 'Internal Server Error'
	const fieldError = error.fieldError
	return res.status(statusCode).json({ message, fieldError })
}