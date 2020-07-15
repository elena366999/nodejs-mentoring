import { User, UserDto, UserModel, UserStatic } from '../models/user.model';
import sequelize from 'sequelize';
import BaseRepository from './base-repository';
import Boom from '@hapi/boom';

export default class UserRepository extends BaseRepository<UserModel, UserStatic> {
    constructor() {
        super(User);
    }

    async create(dto: UserDto): Promise<UserModel> {
        const [user, created]: [UserModel, boolean] = await User.findOrCreate({
            where: { login: dto.login },
            defaults: dto
        });
        if (!created) {
            throw Boom.badRequest('Login already in use');
        }
        return user;
    }

    getAllUsers(showDeleted: boolean | null): Promise<UserModel[]> {
        return this.model.findAll()
            .then((users: UserModel[]) => showDeleted
                ? users
                : users.filter(u => !u.isDeleted));
    }

    deleteById(id: string): Promise<UserModel> {
        return this.model.update({ isDeleted: true }, {
            where: { id },
            individualHooks: true
        })
            .then(() => User.findByPk(id), () => this.handleNotFound(id));
    }

    findByLogin(login: string): Promise<UserModel> {
        return User.findOne({
            where: {
                login
            }
        })
            .then(this.handleNotFound(`Entity with login ${login} not found`));
    }

    getUsersWhereLoginContainsLimited(loginSubstring: string, limit: number): Promise<UserModel[]> {
        return User.findAll({
            limit,
            order: [
                ['login', 'ASC']
            ],
            where: {
                login: sequelize.where(sequelize.fn('LOWER', sequelize.col('login')),
                    'LIKE', `%${loginSubstring.toLowerCase()}%`)
            }
        });
    }

    findByLoginAndPassword(login: string, password: string): Promise<UserModel> {
        return User.findOne({
            where:
                { login, password }
        })
            .then(this.handleNotFound('Bad login/password combination'));
    }
}
