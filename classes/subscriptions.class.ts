import { QueryResult } from 'pg';

import { client } from '../index'
import { ISubscription } from '../models/subscription.model';

export class SubscriptionDB {
    constructor() {}

    static async find(companyId: string, productId: string): Promise<ISubscription | undefined> {
        const qr: QueryResult = await client.query(`SELECT * from subscriptions WHERE company_id = $1 
                                                    AND product_id = $2`, [companyId, productId]);
        if (qr.rows.length) {
            return qr.rows[0]
        } else return undefined
    }

    static async findById(id: string): Promise<ISubscription | undefined> {
        const qr: QueryResult = await client.query(`SELECT * from subscriptions WHERE id = $1`, [id]);
        if (qr.rows.length) {
            return qr.rows[0]
        } else return undefined
    }

    static async add(startDate: Date, endDate: Date, companyId: string, productId: string): Promise<void> {
        await client.query(`INSERT INTO subscriptions(start_date, end_date, company_id, product_id)
                            VALUES ($1, $2, $3, $4)`, [startDate, endDate, companyId, productId])
    }

    static async update(startDate: Date, endDate: Date, id: string): Promise<void> {
        await client.query('UPDATE subscriptions SET start_date = $1, end_date = $2 WHERE id=$3', [startDate, endDate, id])
    }

    static async delete(id: string): Promise<void> {
        await client.query('DELETE FROM subscriptions WHERE id=$1', [id])
    }

    static async checkEndDate(productId: string, companyId: string): Promise<Date | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM subscriptions WHERE product_id = $1 AND company_id = $2', [productId, companyId]);
        if (qr.rows.length) {
            return qr.rows[0].end_date;
        } else return undefined
    }

    static async checkActive(productId: string, companyId: string): Promise<ISubscription[] | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM subscriptions WHERE product_id = $1 AND company_id = $2 AND end_date >= now()::date', [productId, companyId]);
        if (qr.rows.length) {
            return qr.rows;
        } else return undefined
    }
        
}