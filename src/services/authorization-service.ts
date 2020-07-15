import { UserModel } from '../models/user.model';
import UserRepository from '../data-access/user-repository';

export class AuthorizationService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    login(login: string, password:string): Promise<UserModel> {
        return this.userRepository.findByLoginAndPassword(login, password);
    }
}
