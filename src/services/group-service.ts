import GroupRepository from '../data-access/group-repository';
import { GroupModel, GroupStatic } from '../models/group.model';
import BaseService from './base-service';
import { UserModel } from '../models/user.model';

export class GroupService extends BaseService<GroupModel, GroupStatic, GroupRepository> {
    constructor() {
        super(new GroupRepository());
    }

    public addUsersToGroup(groupId: string, userIds: string[]): Promise<GroupModel> {
        return this.repository.addUsersToGroup(groupId, userIds);
    }

    public getUsers(id: string): Promise<UserModel[]> {
        return this.repository.getUsers(id);
    }
}
