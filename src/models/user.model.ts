import { db } from '../config/dbConfig';
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';
import { Group } from './group.model';
import { UserGroup } from './user-group.model';
import { EntityDto } from './common/entity-dto';

export type UserDto = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
} & EntityDto

export interface UserAttributes {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {
}

export type UserStatic = typeof Model & {
    // eslint-disable-next-line @typescript-eslint/ban-types
    new(values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(sequelize: Sequelize): UserStatic {
    return <UserStatic>sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
}

export const User = UserFactory(db);

User.belongsToMany(Group, {
    through: 'user-group'
});
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
User.afterUpdate((user, options) => {
    if (user.isDeleted === true) {
        UserGroup.destroy({ where: { userId: user.id } });
    }
});
Group.belongsToMany(User, {
    through: 'user-group'
});

