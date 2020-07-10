import { EventEmitter } from 'events';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { logger } from '../../util/logger';
const profiling: EventEmitter = new EventEmitter();

profiling.on('route', ({ elapsedMS }) => {
    logger.info(`Time elapsed: ${elapsedMS}ms`);
});
export const profilingWrapper = (wrappedFunction:RequestHandler) :RequestHandler => {
    return (req:Request, res:Response, next:NextFunction):void => {
        wrappedFunction(req, res, () => {
            const start = Date.now();
            res.once('finish', () => {
                profiling.emit('route', { elapsedMS: Date.now() - start });
            });
            next();
        });
    };
};
