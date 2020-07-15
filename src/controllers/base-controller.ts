import { BuildOptions, Model } from 'sequelize';
import { BaseServiceI } from '../services/base-service-i';
import { NextFunction, Request, Response } from 'express';
import { UserDto } from '../models/user.model';
import { EntityDto } from '../models/common/entity-dto';
import { get } from 'lodash';

export default class BaseController<M extends Model, T extends typeof Model & {
    new(values?: any, options?: BuildOptions): M;
}, S extends BaseServiceI<M, T>> {
    protected service: S;

    constructor(service: S) {
        this.service = service;
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const entities: M[] = await this.service.getAll();
            res.json(entities);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    }

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string =  get(req, 'params.id');

            const entity: M = await this.service.getById(id);
            res.json(entity);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newDto: EntityDto = get(req, 'body');
            const entity: M = await this.service.create(newDto);
            res.status(201).json(entity);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const updatedUserDto: UserDto = get(req, 'body');
            const entity: M = await this.service.update(updatedUserDto);
            res.json(entity);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const entityId: string = get(req, 'params.id');

            const entity: M = await this.service.deleteById(entityId);
            res.json(entity);
        } catch (err) {
            // eslint-disable-next-line callback-return
            next(err);
        }
    };
}
