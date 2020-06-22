import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';
import { db } from '../config/dbConfig';

export type UserGroupStatic = typeof Model & {
    // eslint-disable-next-line @typescript-eslint/ban-types
    new(values?: object, options?: BuildOptions): Model;
};

export function UserGroupFactory(sequelize: Sequelize): UserGroupStatic {
    return <UserGroupStatic>sequelize.define('user-group', {
        groupId: {
            type: DataTypes.UUID,
            references: {
                model: 'Group',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'User',
                key: 'id'
            }
        }
    });
}

export const UserGroup = UserGroupFactory(db);
