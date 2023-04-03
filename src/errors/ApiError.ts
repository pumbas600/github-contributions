import { NextApiResponse } from 'next';

export default class ApiError extends Error {
    private readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }

    public handleResponse(res: NextApiResponse): void {
        res.status(this.statusCode).json({ errors: [this.message] });
    }
}
