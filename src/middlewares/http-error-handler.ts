import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../interfaces/http-exception';

export const handleHttpError = (err: HttpException, _req: Request, res: Response, next: NextFunction): void => {
    if (err.isBoom) {
        const { statusCode, payload } = err.output;
        res.status(statusCode).json(payload);
    } else {
        const { statusCode = 500, message } = err;
        res.status(statusCode).json({ statusCode, message });
    }
    next(err);
};
