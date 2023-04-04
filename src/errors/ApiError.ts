import { NextApiResponse } from 'next';

export default class ApiError extends Error {
    protected readonly statusCode: number;
    protected readonly additionalInfo?: string;

    constructor(message: string, statusCode: number, additionalInfo?: string) {
        super(message);
        this.statusCode = statusCode;
        this.additionalInfo = additionalInfo;
    }

    public handleResponse(res: NextApiResponse): void {
        res.status(this.statusCode).json({ message: this.message, additionalInfo: this.additionalInfo });
    }
}
