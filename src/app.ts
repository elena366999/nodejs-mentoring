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
import { profilingWrapper } from './middlewares/profiling-wrapper';

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
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        });

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
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

