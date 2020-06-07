import sequelize from 'sequelize';

export const initDataFilePath = 'src/fixtures/init-data.json';

export const db = new sequelize.Sequelize(
    (process.env.DB_NAME = 'nodejs_mentoring'),
    (process.env.DB_USER = 'postgres'),
    (process.env.DB_PASSWORD = 'DatabasePW'),
    {
        dialect: 'postgres',
        port: Number(process.env.DB_PORT) || 5432,
        host: process.env.DB_HOST || 'localhost',
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000
        }

    }
);
