import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user-service';
import { UserModel, UserStatic } from '../models/user.model';
import BaseController from './base-controller';
import { get, toNumber } from 'lodash';

export default class UserController extends BaseController<UserModel, UserStatic, UserService> {
    constructor() {
        super(new UserService());
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const showDeleted: boolean = !get(req, 'query.showDeleted') ? false
                : get(req, 'query.showDeleted').trim().toLowerCase() === 'true';

            const users: UserModel[] = await this.service.getAllUsers(showDeleted);
            res.json(users);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    };

    public getAutoSuggestUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loginSubstring :string = get(req, 'query.loginSubstring');
            const limit :number = toNumber(get(req, 'query.limit'));

            const users: UserModel[] = await this.service.getAutoSuggestUsers(loginSubstring, limit);
            res.json(users);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    };
}

