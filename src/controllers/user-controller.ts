import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user-service';
import { UserDto, UserModel, UserStatic } from '../models/user.model';
import BaseController from './base-controller';

export class UserController extends BaseController<UserModel, UserStatic, UserService> {
    constructor() {
        super(new UserService());
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const showDeleted: boolean = !req.query.showDeleted ? false
                : String(req.query.showDeleted).trim().toLowerCase() === 'true';

            const users: UserModel[] = await this.service.getAllUsers(showDeleted);
            res.json(users);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    };

    public getAutoSuggestUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const loginSubstring = String(req.query.loginSubstring);
        const limit = Number(req.query.limit);

        this.service.getAutoSuggestUsers(loginSubstring, limit)
            .then(users => res.json(users))
            .catch(err => next(err));
    };

    public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newUserDto: UserDto = req.body;
            const user: UserModel = await this.service.createUser(newUserDto);
            res.status(201).json(user);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const updatedUserDto: UserDto = req.body;

            const user = await this.service.updateUser(updatedUserDto);
            res.json(user);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId: string = req.params.id;

            const user: UserModel = await this.service.deleteUserById(userId);
            res.json(user);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    }
}

