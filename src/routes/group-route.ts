import express from 'express';
import  GroupController from '../controllers/group-controller';
import { GroupValidation } from '../validation/group-validation';
import { createValidator, ExpressJoiInstance } from 'express-joi-validation';
import { SchemaValidation } from '../validation/common/schema-validation';

export class GroupRoute {
    groupRouter: express.Router;
    groupController: GroupController;
    groupValidation: GroupValidation;
    paramValidation: ExpressJoiInstance;

    constructor() {
        this.groupRouter = express.Router();
        this.groupController = new GroupController();
        this.groupValidation = new GroupValidation();
        this.paramValidation = createValidator();
        this.setRoutes();
    }

    private setRoutes(): void {
        this.groupRouter.get('/', this.groupController.getAll);
        this.groupRouter.get('/:id', this.paramValidation.params(this.groupValidation.idParamSchema),
            this.groupController.getById);
        this.groupRouter.post('/', SchemaValidation.validateSchema(this.groupValidation.schema),
            this.groupController.create);
        this.groupRouter.put('/:id', SchemaValidation.validateSchema(this.groupValidation.schema),
            this.groupController.update);
        this.groupRouter.delete('/:id', this.paramValidation.params(this.groupValidation.idParamSchema),
            this.groupController.delete);
        this.groupRouter.put('/:id/users', this.paramValidation.params(this.groupValidation.idParamSchema),
            this.paramValidation.body(this.groupValidation.userIdsParamSchema),
            this.groupController.addUsersToGroup);
        this.groupRouter.get('/:id/users', this.paramValidation.params(this.groupValidation.idParamSchema),
            this.groupController.getUsers);
    }
}
