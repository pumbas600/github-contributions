import { NextApiResponse } from 'next';
import ApiError from './ApiError';

export default class InternalServerError extends ApiError {
    public static readonly DEFAULT_MESSAGE =
        'There was an unexpected error processing your request. Please report this at  https://github.com/pumbas600/github-contributions/issues.';

    constructor(additionalInfo?: string) {
        super(InternalServerError.DEFAULT_MESSAGE, 500, additionalInfo);
    }
}
