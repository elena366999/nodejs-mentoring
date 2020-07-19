import UserController from '../../controllers/user-controller';
import { UserDto } from '../../models/user.model';

const testUser1 = { id: '1', login: 'test 1' };
const testUser2 = { id: '2', login: 'test 2' };
const testUser3 = { id: '3', login: 'test 3' };
const testUsers = [testUser1, testUser2, testUser3];

const getMultipleUserMockFunction = jest.fn(() => testUsers);
const getSingleUserMockFunction = jest.fn(() => testUser1);

const MockUserService = {
    getAllUsers: getMultipleUserMockFunction,
    getAutoSuggestUsers: getMultipleUserMockFunction,
    getById: getSingleUserMockFunction,
    create: getSingleUserMockFunction,
    update: getSingleUserMockFunction,
    deleteById: getSingleUserMockFunction
};

const userController: UserController = new UserController();

jest.mock('../../services/user-service', () => {
    return jest.fn().mockImplementation(() => (MockUserService));
});
const req: any = {};
const res: any = {
    json: jest.fn(),
    status: jest.fn()
};
const next = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe('UserController', () => {
    it('should find all users with showDeleted:false and return result in the response', async () => {
        const showDeleted = false;

        await userController.getAll({ ...req }, res, next);

        expect(MockUserService.getAllUsers).toBeCalledWith(showDeleted);
        expect(res.json).toBeCalledWith(testUsers);
    });

    it('should find all users via UserService and return result in the response', async () => {
        const loginSubstring = 'test';
        const limit = 5;

        await userController.getAutoSuggestUsers({ ...req, query: { loginSubstring, limit } }, res, next);

        expect(MockUserService.getAutoSuggestUsers).toBeCalledWith(loginSubstring, limit);
        expect(res.json).toBeCalledWith(testUsers);
    });

    it('should find a user by id via UserService and return result in the response', async () => {
        const id = '1';

        await userController.getById({ ...req, params: { id } }, res, next);

        expect(MockUserService.getById).toBeCalledWith(id);
        expect(res.json).toBeCalledWith(testUser1);
    });

    it('should create user via UserService and return correct status', async () => {
        const user: UserDto = { id: '1', login: 'test 1', password: '12345678', age: 20, isDeleted: false };

        await userController.create({ ...req, body: user }, res, next);

        expect(MockUserService.create).toBeCalledWith(user);
        expect(res.status).toBeCalledWith(201);
    });

    it('should update user via UserService and return result in the response', async () => {
        const user: UserDto = { id: '1', login: 'test 1', password: '12345678', age: 37, isDeleted: false };
        const id = '1';

        await userController.update({ ...req, params: { id }, body: user }, res, next);

        expect(MockUserService.update).toBeCalledWith(user);
        expect(res.json).toBeCalledWith(testUser1);
    });

    it('should delete user via UserService and return deleted user in the response', async () => {
        const id = '1';

        await userController.delete({ ...req, params: { id } }, res, next);

        expect(MockUserService.deleteById).toBeCalledWith(id);
        expect(res.json).toBeCalledWith(testUser1);
    });
});
