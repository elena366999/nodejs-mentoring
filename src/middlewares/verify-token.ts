import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import jwt from 'jsonwebtoken';
import { SECRET } from '../controllers/authorization-controller';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token: string = get(req, "headers['x-access-token']");

    if (token) {
        jwt.verify(token, SECRET, (err: any) => {
            if (err) {
                res.status(403).send({
                    success: false,
                    message: 'Access denied, provided token is invalid.'
                });
            } else {
                // eslint-disable-next-line callback-return
                next();
            }
        });
    } else {
        res.status(401).send({
            success: false,
            message: 'Access denied, no access toke is provided'
        });
    }
};
