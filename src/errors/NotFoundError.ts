import ApiError from './ApiError';

export default class NotFoundError extends ApiError {
    constructor(message: string, additionalInfo?: string) {
        super(message, 404, additionalInfo);
    }
}
