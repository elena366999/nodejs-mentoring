import { Request, Response } from 'express';
import { UserService } from '../services/user-service';
import { UserDto, UserModel } from '../models/user.model';

export class UserController {
    userService: UserService = new UserService();

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        const showDeleted: boolean = !req.query.showDeleted ? false
            : String(req.query.showDeleted).trim().toLowerCase() === 'true';

        await this.userService.getAllUsers(showDeleted)
            .then(users => res.json(users))
            .catch(err => this.sendResponseWithStatusAndMessage(res, 500, err.message));
    };

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        const id: string = req.params.id;

        await this.userService.getUserById(id)
            .then(user => this.processResponse(res, user, id))
            .catch(err => this.sendResponseWithStatusAndMessage(res, 500, err.message));
    };

    public getAutoSuggestUsers = async (req: Request, res: Response): Promise<void> => {
        const loginSubstring = String(req.query.loginSubstring);
        const limit = Number(req.query.limit);

        await this.userService.getAutoSuggestUsers(loginSubstring, limit)
            .then(users => res.json(users))
            .catch(err => this.sendResponseWithStatusAndMessage(res, 500, err.message));
    };

    public createUser = async (req: Request, res: Response): Promise<void> => {
        const newUserDto: UserDto = req.body;
        const canBeProcessed = await this.canBeProcessedByLogin(res, newUserDto.login, newUserDto.id);
        if (canBeProcessed) {
            try {
                const user = await this.userService.createUser(newUserDto);
                res.status(201).json(user);
            } catch (err) {
                this.sendResponseWithStatusAndMessage(res, 500, err.message);
            }
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        const updatedUserDto: UserDto = req.body;
        const canBeProcessed = await this.canBeProcessedByLogin(res, updatedUserDto.login, updatedUserDto.id);
        if (canBeProcessed) {
            try {
                const user = await this.userService.updateUser(updatedUserDto);
                await this.processResponse(res, user, updatedUserDto.id);
            } catch (err) {
                this.sendResponseWithStatusAndMessage(res, 500, err.message);
            }
        }
    };

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.params.id;

        await this.userService.deleteUserById(userId)
            .then(user => this.processResponse(res, user, userId))
            .catch(err => this.sendResponseWithStatusAndMessage(res, 500, err.message));
    };

    private processResponse(res: Response, user: UserModel | null, id: string) {
        if (user) {
            res.json(user);
        } else {
            this.sendResponseWithStatusAndMessage(res, 404, `User with id ${id} not found`);
        }
    }

    private async canBeProcessedByLogin(res: Response, login: string, id: string): Promise<boolean> {
        const user = await this.userService.getByLogin(login);
        if (user && user.id !== id) {
            this.sendResponseWithStatusAndMessage(res, 400, `Login [${login}] already in use`);
            return false;
        }
        return true;
    }

    private sendResponseWithStatusAndMessage(res: Response, status: number,  message : string): void {
        res.status(status).json({ message });
    }
}

