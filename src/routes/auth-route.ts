import express from 'express';
import  AuthorizationController  from '../controllers/authorization-controller';
import { LoginValidation } from '../validation/login-validation';
import { SchemaValidation } from '../validation/common/schema-validation';

export class AuthRoute {
    authRouter: express.Router;
    authController: AuthorizationController;
    loginValidation: LoginValidation;

    constructor() {
        this.authRouter = express.Router();
        this.authController = new AuthorizationController();
        this.loginValidation = new LoginValidation();
        this.setRoutes();
    }

    private setRoutes(): void {
        this.authRouter.post('/login', SchemaValidation.validateSchema(this.loginValidation.schema), this.authController.login);
    }
}
