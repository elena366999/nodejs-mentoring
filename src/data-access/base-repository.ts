import { BuildOptions, Model } from 'sequelize';
import Boom from '@hapi/boom';
import { EntityDto } from '../models/common/entity-dto';

export default class BaseRepository<M extends Model, T extends typeof Model & {
    new(values?: any, options?: BuildOptions): M;
}> {
    protected model: T;

    constructor(model: T) {
        this.model = model;
    }

    public getAll(): Promise<M[]> {
        return this.model.findAll();
    }

    public getById(id: string): Promise<M> {
        return this.model.findByPk(id).then(this.handleNotFound(`Entity with id ${id} not found`));
    }

    public getByIds(ids: string[]): Promise<M[]> {
        return this.model.findAll({
            where: {
                id: ids
            }
        });
    }

    public create(dto: EntityDto): Promise<M> {
        return this.model.create(dto);
    }

    public update(dto: EntityDto): Promise<M> {
        return this.model.update(dto, { where: { id: dto.id } })
            .then(() => this.model.findByPk(dto.id),
                () => this.handleNotFound(`Entity with id ${dto.id} not found`));
    }

    public deleteById(id: string): Promise<M> {
        return this.model.findByPk(id)
            .then(this.handleNotFound(`Entity with id ${id} not found`))
            .then((entity: M) => {
                this.model.destroy({ where: { id } });
                return entity;
            });
    }

    protected handleNotFound = (message: string) => (entity: M | null): M => {
        if (!entity) {
            throw Boom.notFound(message);
        }
        return entity;
    }
}
