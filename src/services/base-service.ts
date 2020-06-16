import BaseRepository from '../data-access/base-repository';
import { BuildOptions, Model } from 'sequelize';
import { BaseServiceI } from './base-service-i';
import { EntityDto } from '../models/common/entity-dto';

export default class BaseService<M extends Model, T extends typeof Model & {
    new(values?: any, options?: BuildOptions): M;
}, R extends BaseRepository<M, T>> implements BaseServiceI<M, T> {
    protected repository: R;

    constructor(repository: R) {
        this.repository = repository;
    }

    public getAll(): Promise<M[]> {
        return this.repository.getAll();
    }

    public getById(id: string): Promise<M> {
        return this.repository.getById(id);
    }

    public getByIds(ids: string[]): Promise<M[]> {
        return this.repository.getByIds(ids);
    }

    public create(dto: EntityDto): Promise<M> {
        return this.repository.create(dto);
    }

    public update(dto: EntityDto): Promise<M> {
        return this.repository.update(dto);
    }

    public deleteById(id: string): Promise<M> {
        return this.repository.deleteById(id);
    }
}
