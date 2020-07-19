import BaseController from './base-controller';
import { GroupModel, GroupStatic } from '../models/group.model';
import  GroupService  from '../services/group-service';
import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { get } from 'lodash';

export default class GroupController extends BaseController<GroupModel, GroupStatic, GroupService> {
    constructor() {
        super(new GroupService());
    }

    public addUsersToGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userIds: string[] = get(req, 'body.userIds');
            const id: string = get(req, 'params.id');

            const group: GroupModel = await this.service.addUsersToGroup(id, userIds);
            res.json(group);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    }

    public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = get(req, 'params.id');

            const users: UserModel[] = await this.service.getUsers(id);
            res.json(users);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    }
}
