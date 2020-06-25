import { NextFunction, Request, Response } from 'express';
import { logger } from '../util/logger';

export const logRequestData = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`Request: ${req.method} ${req.url}, body: ${JSON.stringify(req.body)}`);
    next();
};

