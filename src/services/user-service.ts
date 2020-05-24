import users from '../data/users';
import { User } from '../models/user.model';
import { v1 as uuidv1 } from 'uuid';
import * as stringUtils from '../util/string-utils';

export class UserService {
    getAllUsers(showDeleted: boolean) {
        return new Promise((resolve, reject) => {
            if (users.length === 0) {
                reject({
                    message: 'No users found',
                    status: 202
                });
            }
            resolve(showDeleted ? users : users.filter(u => !u.isDeleted));
        });
    }

    getUserById(id: string) {
        return new Promise((resolve, reject) => {
            this.getCurrentUser(id)
                .then(user => resolve(user))
                .catch(err => reject(err));
        });
    }

    createUser(user: User) {
        return new Promise((resolve) => {
            this.createNewUser(user);
            resolve(user);
        });
    }

    updateUser(user: User) {
        return new Promise((resolve, reject) => {
            this.getCurrentUser(user.id)
                .then(currentUser => {
                    const currentUserIndex: number = users.findIndex(u => u.id === currentUser.id);
                    users[currentUserIndex] = user;
                    resolve(user);
                })
                .catch(err => reject(err));
        });
    }

    deleteUserById(id: string) {
        return new Promise((resolve, reject) => {
            this.getCurrentUser(id)
                .then((user) => {
                    users
                        .filter(u => u.id === id)
                        .forEach(u => u.isDeleted = true);
                    resolve(user);
                })
                .catch(err => reject(err));
        });
    }

    getAutoSuggestUsers(loginSubstring: string, limit: number) {
        return new Promise((resolve, reject) => {
            this.filterUsersByLoginSubstring(users, loginSubstring)
                .then(this.sortUsersByLogin)
                .then(result => resolve(limit ? this.limitUsers(result, limit) : result))
                .catch(err => reject(err));
        }
        );
    }

    getCurrentUser(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const row = users.find(u => u.id === id);
            if (!row) {
                reject({
                    message: `User with id ${id} is not found`,
                    status: 404
                });
            }
            resolve(row);
        });
    }

    filterUsersByLoginSubstring(usrs: User[], loginSubstring: string): Promise<User[]> {
        return new Promise((resolve) => {
            resolve(usrs.filter(u => stringUtils.includesIgnoreCase(u.login, loginSubstring)));
        });
    }

    sortUsersByLogin(usrs: User[]): Promise<User[]> {
        return new Promise((resolve) => {
            resolve(usrs.sort((u1, u2) => {
                return stringUtils.sortIgnoreCase(u1.login, u2.login);
            }));
        });
    }

    limitUsers(usrs: User[], limit: number): Promise<User[]> {
        return new Promise((resolve) => {
            resolve(usrs.slice(0, limit));
        });
    }

    createNewUser(user: User) {
        user.id = uuidv1();
        users.push(user);
    }
}

