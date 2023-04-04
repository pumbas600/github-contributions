import ApiError from './ApiError';

export default class BadRequestError extends ApiError {
    constructor(message: string, additionalInfo?: string) {
        super(message, 400, additionalInfo);
    }
}
