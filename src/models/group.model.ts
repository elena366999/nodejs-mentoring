import { db } from '../config/dbConfig';
import { UserModel } from './user.model';
import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BuildOptions,
    DataTypes,
    Model,
    Sequelize
} from 'sequelize';
import { EntityDto } from './common/entity-dto';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES'

export type GroupDto = {
    name: string;
    permissions: Permission[];
} & EntityDto

export interface GroupAttributes {
    id: string;
    name: string;
    permissions: Permission[];
    users?: UserModel[] | UserModel['id'][];
}

export interface GroupModel extends Model<GroupAttributes>, GroupAttributes {
    getUsers: BelongsToManyGetAssociationsMixin<UserModel>;
    addUsers: BelongsToManyAddAssociationsMixin<UserModel, UserModel['id']>;
    addUser: BelongsToManyAddAssociationMixin<UserModel, UserModel['id']>;
}

export type GroupStatic = typeof Model & {
    // eslint-disable-next-line @typescript-eslint/ban-types
    new(values?: object, options?: BuildOptions): GroupModel;
};

export function GroupFactory(sequelize: Sequelize): GroupStatic {
    return <GroupStatic>sequelize.define('group', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.ENUM('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')),
            allowNull: false,
            defaultValue: []
        }
    });
}

export const Group = GroupFactory(db);
