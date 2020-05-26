import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { UserService } from '../services/user-service';

export class UserController {
    userService: UserService = new UserService();

    public getAllUsers = async (req: Request, res: Response) :Promise<void> => {
        const showDeleted: boolean = !req.query.showDeleted ? false
            : String(req.query.showDeleted).trim().toLowerCase() === 'true';
        await this.userService.getAllUsers(showDeleted)
            .then(users => res.json(users));
    };

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        const id: string = req.params.id;

        await this.userService.getUserById(id)
            .then(user => res.json(user))
            .catch(err => {
                res.status(err.status).json({ message: err.message });
            });
    };

    public getAutoSuggestUsers = async (req: Request, res: Response) :Promise<void> => {
        const loginSubstring = String(req.query.loginSubstring);
        const limit = Number(req.query.limit);

        await this.userService.getAutoSuggestUsers(loginSubstring, limit)
            .then(users => res.json(users));
    };

    public createUser = async (req: Request, res: Response) :Promise<void> => {
        const newUser: User = req.body;

        await this.userService.createUser(newUser)
            .then(user => res.status(201).json(user));
    };

    public updateUser = async (req: Request, res: Response) :Promise<void> => {
        const updatedUser: User = req.body;

        await this.userService.updateUser(updatedUser)
            .then(user => res.status(200).json(user))
            .catch(err => {
                res.status(err.status).json({ message: err.message });
            });
    };

    public deleteUser = async (req: Request, res: Response):Promise<void> => {
        const userId: string = req.params.id;

        await this.userService.deleteUserById(userId)
            .then(user => res.status(200).json(user))
            .catch(err => {
                res.status(err.status).json({ message: err.message });
            });
    };
}

