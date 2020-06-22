import { UserDto, UserModel, UserStatic } from '../models/user.model';
import UserRepository from '../data-access/user-repository';
import BaseService from './base-service';

export class UserService extends BaseService<UserModel, UserStatic, UserRepository> {
    constructor() {
        super(new UserRepository());
    }

    getAllUsers(showDeleted: boolean): Promise<UserModel[]> {
        return this.repository.getAllUsers(showDeleted);
    }

    createUser(user: UserDto): Promise<UserModel> {
        return this.repository.create(user);
    }

    updateUser(user: UserDto): Promise<UserModel> {
        return this.repository.update(user);
    }

    deleteUserById(id: string): Promise<UserModel> {
        return this.repository.deleteById(id);
    }

    getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<UserModel[]> {
        return this.repository.getUsersWhereLoginContainsLimited(loginSubstring, limit);
    }

    getByLogin(login: string): Promise<UserModel> {
        return this.repository.findByLogin(login);
    }
}

