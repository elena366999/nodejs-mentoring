import express from 'express';
import {SchemaValidation} from '../../validation/schema-validation';
import {UserController} from '../../controllers/user-controller';
import {createValidator, ExpressJoiInstance} from 'express-joi-validation';
import {UserValidation} from "../../validation/user/user-validation";

export class UserRoute {
    userRouter: express.Router;
    filterValidator: ExpressJoiInstance;
    userController: UserController;
    userValidation: UserValidation;

    constructor() {
        this.userRouter = express.Router();
        this.filterValidator = createValidator();
        this.userController = new UserController();
        this.userValidation = new UserValidation();
        this.setRoutes();
    }

    private setRoutes(): void {
        this.userRouter.get('/', this.userController.getAllUsers);
        this.userRouter.get('/filter', this.filterValidator.query(this.userValidation.filterParamsSchema),
            this.userController.getAutoSuggestUsers);
        this.userRouter.get('/:id', this.userController.getUserById);
        this.userRouter.post('/', SchemaValidation.validateSchema(this.userValidation.schema),
            this.userController.createUser);
        this.userRouter.put('/:id', SchemaValidation.validateSchema(this.userValidation.schema),
            this.userController.updateUser);
        this.userRouter.delete('/:id', this.userController.deleteUser);
    }
}
