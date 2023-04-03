import ApiError from './ApiError';

export default class BadRequestError extends ApiError {
    constructor(message: string) {
        super(message, 400);
    }
}
