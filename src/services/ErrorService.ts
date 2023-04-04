import ApiError from '@/errors/ApiError';
import InternalServerError from '@/errors/InternalServerError';
import { NextApiResponse } from 'next';
import { ZodError } from 'zod';

export namespace ErrorService {
    export function handleError(res: NextApiResponse, error: unknown): void {
        if (error instanceof ZodError) {
            res.status(400).json({
                errors: error.issues.map((issue) => ({
                    message: issue.message,
                })),
            });
            return;
        }
        if (error instanceof ApiError) {
            error.handleResponse(res);
            return;
        }

        // These are internal server errors that we want to know about.
        console.error(error);
        res.status(501).json({
            errors: [{ message: InternalServerError.DEFAULT_MESSAGE }],
        });
    }
}
