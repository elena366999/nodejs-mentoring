import express from 'express';
import { UserRoute } from '../user-route';
import { GroupRoute } from '../group-route';

export class AppRoute {
    router: express.Router;
    userRoute: UserRoute = new UserRoute();
    groupRoute: GroupRoute = new GroupRoute();

    constructor() {
        this.router = express.Router();
        this.router.use('/users', this.userRoute.userRouter);
        this.router.use('/groups', this.groupRoute.groupRouter);
    }
}
