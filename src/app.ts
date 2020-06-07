import express from 'express';
import { AppRoute } from './routes/app-route';
import sequelizeFixtures from 'sequelize-fixtures';
import { dbConnection, initDataFilePath } from './config/dbConfig';
import { User } from './models/user.model';

export const models = {
    User
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
        this.app.use('/api', this.appRoute.router);
    }

    private dbConfig(): void {
        Promise.all([
            dbConnection.sync(),
            sequelizeFixtures.loadFile(initDataFilePath, models)
        ])
            .catch(error => {
                console.log(`Something went wrong while connecting to db: ${error.message}`);
            });
    }
}

export default new App().app;

