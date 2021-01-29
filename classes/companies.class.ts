import { QueryResult } from 'pg';

import { client } from '../index'
import { ICompany } from '../models/company.model';

export class CompaniesDB {
    constructor() { }

    static async findByCompanyInn(companyInn: string): Promise<ICompany | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM companies WHERE inn = $1', [companyInn]);
        if (qr.rows.length) {
            return qr.rows[0];
        } else return undefined
    }

    static async registerAndReturnCompanyId(companyName: string, companyInn: string): Promise<string> {
        const id: string = (await client.query('INSERT INTO companies(name, inn) VALUES ($1, $2) RETURNING id;', [companyName, companyInn])).rows[0].id;
        return id;
    }

    static async updateAndReturnAdminCompanyId(companyName: string, companyInn: string): Promise<string> {
        const id: string = (await client.query(`UPDATE companies SET name = $1, inn = $2 WHERE id= '1' RETURNING id`, [companyName, companyInn])).rows[0].id;
        return id;
    }

    static async getAll(): Promise<ICompany[] | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM companies')
        if (qr.rows.length) {
            return qr.rows
        } else return undefined
    }
}