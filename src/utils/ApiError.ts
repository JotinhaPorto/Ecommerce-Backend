export type FieldError = "email" | "password"

export class ApiErrorValidationFields extends Error {

    public readonly statusCode: number
    public fieldError?: FieldError

    constructor(message: string, statusCode: number, fieldError?: FieldError) {
        super(message)
        this.statusCode = statusCode;
        this.fieldError = fieldError
    }


}