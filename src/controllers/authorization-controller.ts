import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { get, toNumber } from 'lodash';
import { UserModel } from '../models/user.model';
import  AuthorizationService  from '../services/authorization-service';

const JWT_EXPIRES = process.env.JWT_EXPIRES || 100;
export const SECRET = process.env.SECRET || 'secret';

export default class AuthorizationController {
    private authService:AuthorizationService;

    constructor() {
        this.authService = new AuthorizationService();
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const login = get(req, 'body.login');
            const password = get(req, 'body.password');

            const user: UserModel = await this.authService.login(login, password);
            const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: toNumber(JWT_EXPIRES) });

            res.json(token);
        } catch (e) {
            // eslint-disable-next-line callback-return
            next(e);
        }
    }
}
