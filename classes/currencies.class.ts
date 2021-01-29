import { QueryResult } from 'pg';
import request from 'request-promise'

import { client } from '../index'
import { ICurrency } from '../models/currencies.model'

const options = {
    method: 'GET',
    uri: 'https://www.cbr-xml-daily.ru/daily_json.js',
    json: true
}

export class CurrenciesDB {
    constructor(usdValue: number, eurValue: number) {
        setInterval(async () => {
            try {
                await client.query('BEGIN');
                await client.query(`UPDATE currencies SET value = $1 WHERE charcode = 'USD'`, [usdValue]);
                await client.query(`UPDATE currencies SET value = $1 WHERE charcode = 'EUR'`, [eurValue]);
                await client.query('COMMIT');
                // console.log(`Курс Доллара США - ${usdValue}, курс Евро - ${eurValue}`);
            } catch (error) {
                console.error(error)
            }
        }, 1000 * 60)
    }

    static async getCurrency(): Promise<{ usd: ICurrency; eur: ICurrency } | void> {
        try {
            const currencies = await request(options);
            const usd = currencies.Valute.USD;
            const eur = currencies.Valute.EUR;
            return { usd, eur }
        } catch (error) {
            console.error(error);
        }
    }

    static async insert(usdCharCode: string, usdName: string, usdValue: Number, eurCharCode: string, eurName: string, eurValue: Number): Promise<void> {
        const qr: QueryResult = await client.query('SELECT * FROM currencies')
        if (qr.rows.length) {
            try {
                await client.query('BEGIN');
                await client.query(`UPDATE currencies SET value = $1 WHERE charcode = 'USD'`, [usdValue]);
                await client.query(`UPDATE currencies SET value = $1 WHERE charcode = 'EUR'`, [eurValue]);
                await client.query('COMMIT');
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                await client.query('INSERT INTO currencies(charcode, name, value) VALUES ($1, $2, $3), ($4, $5, $6)', [usdCharCode, usdName, usdValue, eurCharCode, eurName, eurValue])
            } catch (error) {
                console.error(error)
            }
        }
    }

    static initialize(usdValue: number, eurValue: number) {
        if (!currenciesDB) {
            currenciesDB = new CurrenciesDB(usdValue, eurValue);
        }
    }
}

export let currenciesDB: CurrenciesDB;