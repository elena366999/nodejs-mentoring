import GroupController from '../../controllers/group-controller';
import { GroupDto } from '../../models/group.model';

const testUser1 = { id: '1', login: 'test 1', age: '45', isDeleted: false };
const testUser2 = { id: '2', login: 'test 2', age: '32', isDeleted: false };
const testUsers = [testUser1, testUser2];

const testGroup1 = { id: '1', name: 'Group 1', permissions: ['READ', 'WRITE'], users: testUsers };
const testGroup2 = { id: '2', name: 'Group 2', permissions: ['READ', 'SHARE'] };
const testGroup1Updated = { id: '1', name: 'Group 1', permissions: ['READ', 'WRITE', 'SHARE'], users: testUsers };

const testGroups = [testGroup1, testGroup2];

const getMultipleGroupMockFunction = jest.fn(() => testGroups);
const getSingleGroupMockFunction = jest.fn(() => testGroup1);
const getSingleGroupUpdatedMockFunction = jest.fn(() => testGroup1Updated);
const getGroupUsersMockFunction = jest.fn(() => testUsers);

const MockGroupService = {
    getAll: getMultipleGroupMockFunction,
    getById: getSingleGroupMockFunction,
    create: getSingleGroupMockFunction,
    update: getSingleGroupUpdatedMockFunction,
    deleteById: getSingleGroupMockFunction,
    addUsersToGroup: getSingleGroupMockFunction,
    getUsers: getGroupUsersMockFunction
};

const groupController: GroupController = new GroupController();

jest.mock('../../services/group-service', () => {
    return jest.fn().mockImplementation(() => (MockGroupService));
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

describe('GroupController', () => {
    it('should find all groups and return result in the response', async () => {
        await groupController.getAll({ ...req }, res, next);

        expect(MockGroupService.getAll);
        expect(res.json).toBeCalledWith(testGroups);
    });

    it('should find a group by id via GroupService and return result in the response', async () => {
        const id = '1';

        await groupController.getById({ ...req, params: { id } }, res, next);

        expect(MockGroupService.getById).toBeCalledWith(id);
        expect(res.json).toBeCalledWith(testGroup1);
    });

    it('should create a new group and return correct status in the response', async () => {
        const group: GroupDto = { id: '1', name: 'Group 1', permissions: ['WRITE', 'READ'] };

        await groupController.create({ ...req, body: group }, res, next);

        expect(MockGroupService.create).toBeCalledWith(group);
        expect(res.status).toBeCalledWith(201);
    });

    it('should update group via GroupService and return result in the response', async () => {
        const group: GroupDto = { id: '1', name: 'Group 1', permissions: ['WRITE', 'READ', 'SHARE'] };
        const id = '1';

        await groupController.update({ ...req, params: { id }, body: group }, res, next);

        expect(MockGroupService.update).toBeCalledWith(group);
        expect(res.json).toBeCalledWith(testGroup1Updated);
    });

    it('should delete group and return deleted group in the response', async () => {
        const id = '1';

        await groupController.delete({ ...req, params: { id } }, res, next);

        expect(MockGroupService.deleteById).toBeCalledWith(id);
        expect(res.json).toBeCalledWith(testGroup1);
    });

    it('should add users to group and return the group in the response', async () => {
        const id = '1';
        const dto = { userIds: ['1', '2'] };

        await groupController.addUsersToGroup({ ...req, params: { id }, body: dto }, res, next);

        expect(MockGroupService.addUsersToGroup).toBeCalledWith(id, dto.userIds);
        expect(res.json).toBeCalledWith(testGroup1);
    });

    it('should return users by the group id in the response', async () => {
        const id = '1';

        await groupController.getUsers({ ...req, params: { id } }, res, next);

        expect(MockGroupService.getUsers).toBeCalledWith(id);
        expect(res.json).toBeCalledWith(testUsers);
    });
});
