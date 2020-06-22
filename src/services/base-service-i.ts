import { BuildOptions, Model } from 'sequelize';
import { EntityDto } from '../models/common/entity-dto';

export interface BaseServiceI<M extends Model, T extends typeof Model & {
    new(values?: any, options?: BuildOptions): M;
}> {

    getAll(): Promise<M[]>;

    getById(id: string): Promise<M>;

    getByIds(ids: string[]): Promise<M[]>;

    create(dto: EntityDto): Promise<M>;

    update(dto: EntityDto): Promise<M>;

    deleteById(id: string): Promise<M>;

}
