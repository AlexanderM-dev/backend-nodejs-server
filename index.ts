import express from 'express';
import * as packageJSON from './package.json';

// Db
import { Client, QueryResult } from 'pg';

// Third party
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth.router';
import { productRouter } from './routes/product.router'
import { subscriptionRouter } from './routes/subscription.router'
import { companyRouter } from './routes/company.router';
import { TokenService } from './classes/tokenservice.class';
import { DataBase } from './classes/db.class'
import { CurrenciesDB } from './classes/currencies.class';
import { ICurrency } from './models/currencies.model'


const appVersion: string = packageJSON.version;

dotenv.config();

export const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432)
})

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use(`/api/v${appVersion}/auth`, authRouter);
app.use(`/api/v${appVersion}/product`, productRouter);
app.use(`/api/v${appVersion}/subscription`, subscriptionRouter);
app.use(`/api/v${appVersion}/company`, companyRouter);

async function start() {
    try {
        // db
        await client.connect();
        const findTables: QueryResult = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
                                                            AND table_schema IN('public', 'myschema') AND table_name = 'db_version';`)
        if (findTables.rows.length) {
            const findTableDbVersion: QueryResult = await client.query('SELECT * FROM db_version ORDER BY id DESC LIMIT 1');
            if (findTableDbVersion.rows.length) {
                const dbVersion = await findTableDbVersion.rows[0].version;
                if (+dbVersion.slice(0, dbVersion.indexOf('.')) === +appVersion.slice(0, appVersion.indexOf('.'))) {                           // сравниваем версии приложения и БД
                    console.log('База подключена');
                } else {
                    console.log(`Версия приложения (${appVersion}) и базы данных (${dbVersion}) отличается. Приложение не запущено`);
                    await client.end();
                    return;
                }
            } else {
                console.log('Таблица версии базы данных не обнаружена. Приложение не запущено');
                await client.end();
                return;
            }
        } else {
            await DataBase.create();
            console.log('База создана и подключена');
        };

        // Курс валют
        const currencies: { usd: ICurrency; eur: ICurrency } | void = await CurrenciesDB.getCurrency();
        if (currencies) {
            const usd: ICurrency = currencies.usd;
            const eur: ICurrency = currencies.eur;
            CurrenciesDB.insert(usd.CharCode, usd.Name, usd.Value, eur.CharCode, eur.Name, eur.Value);
            CurrenciesDB.initialize(usd.Value, eur.Value);
        } else {
            console.log('Ошибка в получении актуального курса валют');
        }
        
        // Инициализация сервисов
        TokenService.initialize();
        // Web server
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server has been started on port ${port}`));
    } catch (error) {
        console.log(error)
    }
};

start();