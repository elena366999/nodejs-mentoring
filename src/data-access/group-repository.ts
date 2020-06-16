import { Group, GroupDto, GroupModel, GroupStatic } from '../models/group.model';
import BaseRepository from './base-repository';
import { User, UserModel } from '../models/user.model';
import { db } from '../config/dbConfig';
import { Transaction } from 'sequelize';
import Boom from '@hapi/boom';

export default class GroupRepository extends BaseRepository<GroupModel, GroupStatic> {
    constructor() {
        super(Group);
    }

    async create(dto: GroupDto): Promise<GroupModel> {
        const [group, created]: [GroupModel, boolean] = await Group.findOrCreate({
            where: { name: dto.name },
            defaults: dto
        });
        if (!created) {
            throw Boom.badRequest('Group name already in use');
        }
        return group;
    }

    addUsersToGroup(groupId: string, userIds: string[]): Promise<GroupModel> {
        return db.transaction(async (transaction: Transaction) => {
            const users: UserModel[] = await Promise.all(
                userIds.map(async (userId: string) => {
                    const user: UserModel | null = await User.findByPk(userId, { transaction });
                    if (!user) {
                        throw Boom.notFound('User not found');
                    }
                    return user;
                })
            );
            Group.findByPk(groupId, { transaction })
                .then(this.handleNotFound(groupId))
                .then(g => g.addUsers(users, { transaction }));
            return Group.findByPk(groupId, { transaction, include: [User] });
        });
    }

    getUsers(id: string): Promise<UserModel[]> {
        return db.transaction(async (transaction: Transaction) => {
            const group: GroupModel | null = await Group.findByPk(id, { transaction });

            if (!group) {
                throw Boom.notFound(`Group with id ${id} not found`);
            }

            return group.getUsers();
        });
    }
}
