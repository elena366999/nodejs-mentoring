import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ReqPredicate } from '../../types/req-predicate';

export function unless(pred: ReqPredicate, middleware: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (pred(req)) {
            return next();
        }
        middleware(req, res, next);
    };
}
