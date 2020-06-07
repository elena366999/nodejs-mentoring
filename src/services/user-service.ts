import { UserDto, UserModel } from '../models/user.model';
import UserRepository from '../data-access/user-repository';
import Bluebird from 'bluebird';

export class UserService {
    private userRepository: UserRepository = new UserRepository();

    getAllUsers(showDeleted: boolean): Promise<UserModel[]> {
        return this.userRepository.getAll(showDeleted);
    }

    getUserById(id: string): Promise<UserModel> {
        return this.userRepository.getById(id);
    }

    createUser(user: UserDto): Promise<UserModel> {
        return this.userRepository.create(user);
    }

    updateUser(user: UserDto): Bluebird<UserModel | null> {
        return this.userRepository.update(user);
    }

    deleteUserById(id: string): Bluebird<UserModel | null> {
        return this.userRepository.deleteById(id);
    }

    getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<UserModel[]> {
        return this.userRepository.getUsersWhereLoginContainsLimited(loginSubstring, limit);
    }

    getByLogin(login: string): Promise<UserModel> {
        return this.userRepository.findByLogin(login);
    }
}

