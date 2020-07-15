import express from 'express';
import { UserRoute } from '../user-route';
import { GroupRoute } from '../group-route';
import { AuthRoute } from '../auth-route';

export class AppRoute {
    router: express.Router;
    userRoute: UserRoute = new UserRoute();
    groupRoute: GroupRoute = new GroupRoute();
    authRoute: AuthRoute = new AuthRoute();

    constructor() {
        this.router = express.Router();
        this.router.use('/users', this.userRoute.userRouter);
        this.router.use('/groups', this.groupRoute.groupRouter);
        this.router.use('/auth', this.authRoute.authRouter);
    }
}
