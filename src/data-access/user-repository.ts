import { User, UserDto, UserModel } from '../models/user.model';
import sequelize from 'sequelize';
import Bluebird from 'bluebird';

export default class UserRepository {
    getAll(showDeleted: boolean): Promise<UserModel[]> {
        return User.findAll()
            .then((users: UserModel[]) => showDeleted
                ? users
                : users.filter(u => !u.isDeleted));
    }

    getById(id: string): Promise<UserModel> {
        return User.findByPk(id);
    }

    create(user: UserDto): Promise<UserModel> {
        return User.create(user);
    }

    update(user: UserDto): Bluebird<UserModel | null> {
        return User.update(user, { where: { id: user.id } })
            .then(() => User.findByPk(user.id));
    }

    deleteById(id: string): Bluebird<UserModel | null> {
        return User.update({ isDeleted: true }, { where: { id } })
            .then(() => User.findByPk(id));
    }

    findByLogin(login: string): Promise<UserModel> {
        return User.findOne({
            where: {
                login
            }
        });
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
}
