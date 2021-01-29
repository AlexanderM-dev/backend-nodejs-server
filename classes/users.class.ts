import { QueryResult } from 'pg';
import bcrypt from 'bcryptjs'

import { client } from '../index'
import { IUser } from '../models/user.model';


export const salt = bcrypt.genSaltSync(10);

export class UsersDB {
    constructor() { };

    static async findByEmail(email: string): Promise<IUser | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (qr.rows.length) {
            return qr.rows[0];
        } else return undefined
    }

    static async findByEmailAndPassword(password: string, email: string): Promise<IUser | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (qr.rows.length) {
            const passFromDB = qr.rows[0].password;
            const passwordComapareResult = bcrypt.compareSync(password, passFromDB);
            if (passwordComapareResult) {
                const findedUser: IUser = {
                    id: qr.rows[0].id,
                    email: qr.rows[0].email,
                    password: qr.rows[0].password,
                    companyId: qr.rows[0].company_id,
                    surname: qr.rows[0].surname,
                    name: qr.rows[0].name,
                    companyAdmin: qr.rows[0].company_admin,
                    isadmin: qr.rows[0].isadmin
                }
                return findedUser
            } else return undefined
        } else return undefined
    }

    static async registerCompanyAdmin(email: string, password: string, companyId: string, surname: string, name: string): Promise<void> {
        const securedPassword = bcrypt.hashSync(password, salt);
        await client.query('INSERT INTO users(email, password, company_id, surname, name, company_admin) VALUES ($1, $2, $3, $4, $5, true);',
            [email, securedPassword, companyId, surname, name]);
    }

    static async registerUser(email: string, password: string, companyId: string, surname: string, name: string): Promise<void> {
        const securedPassword = bcrypt.hashSync(password, salt);
        await client.query('INSERT INTO users(email, password, company_id, surname, name) VALUES ($1, $2, $3, $4, $5);', [email, securedPassword, companyId, surname, name]);
    }

    static async updateAppAdmin(email: string, password: string, companyId: string, surname: string, name: string): Promise<void> {
        const securedPassword = bcrypt.hashSync(password, salt);
        await client.query(`UPDATE users SET email = $1, password = $2, company_id = $3, surname= $4, name= $5, company_admin = true WHERE id = '1'`,
            [email, securedPassword, companyId, surname, name]);
    }
}