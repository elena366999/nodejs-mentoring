import express from 'express';
import { AppRoute } from './routes/common/app-route';
import sequelizeFixtures from 'sequelize-fixtures';
import { db, initDataFilePath } from './config/dbConfig';
import { User } from './models/user.model';
import { Group } from './models/group.model';
import { handleHttpError } from './middlewares/http-error-handler';
import { logger } from './util/logger';
import Boom from '@hapi/boom';
import { logRequestData } from './middlewares/request-data-logger';
import { profilingWrapper } from './middlewares/wrapper/profiling-wrapper';
import { verifyToken } from './middlewares/verify-token';
import { unless } from './middlewares/wrapper/unless';
import cors from 'cors';

export const models = {
    User,
    Group
};

class App {
    app: express.Application;
    public appRoute: AppRoute = new AppRoute();

    constructor() {
        this.app = express();
        this.commonConfig();
        this.dbConfig();
    }

    private commonConfig(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        this.app.use(unless(req => req.originalUrl === '/api/auth/login', verifyToken));

        this.app.all('*', profilingWrapper(logRequestData));

        this.app.use('/api', this.appRoute.router);

        this.app.use(handleHttpError);

        process
            .on('unhandledRejection', (reason, promise) => {
                logger.error(Boom.badImplementation(`Unhandled Rejection at: ${promise}, reason: ${reason}`));
                process.exit(1);
            })
            .on('uncaughtException', (error: Error) => {
                logger.error(Boom.badImplementation(`Uncaught Exception thrown - ${error}`));
                process.exit(1);
            });
    }

    private dbConfig(): void {
        db.sync().then(
            () => sequelizeFixtures.loadFile(initDataFilePath, models))
            .catch(error => {
                logger.error(`Something went wrong while connecting to db: ${error.message}`);
            });
    }
}

export default new App().app;

