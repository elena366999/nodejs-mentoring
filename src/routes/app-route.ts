import express from 'express';
import { UserRoute } from './user/user-route';

export class AppRoute {
    router: express.Router;
    userRoute: UserRoute = new UserRoute();

    constructor() {
        this.router = express.Router();
        this.router.use('/users', this.userRoute.userRouter);
    }
}
