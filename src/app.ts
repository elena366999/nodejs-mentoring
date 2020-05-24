import express from 'express';
import {AppRoute} from './routes/app-route';

class App {
    app: express.Application;
    public appRoute: AppRoute = new AppRoute();

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        });

        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use('/api', this.appRoute.router);
    }
}

export default new App().app;

