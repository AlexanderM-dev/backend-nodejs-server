import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import { client } from '../index'
import { IUser } from '../models/user.model';

export type TokenData = Pick<IUser, 'id' | 'email' | 'isadmin' | 'companyAdmin' | 'companyId'> & { token: string };

export class TokenService {

    constructor() {
        // TODO. Нужно использовать стрелочные функции (проверить где еще) !!!!!!!! ГОТОВО
        setInterval(() => {
            client.query("DELETE FROM tokens WHERE age(NOW(), logintime) > interval '7' day")
        }, 1000 * 60 * 24)
    };


    async create(userId: number): Promise<string> {
        const newToken = uuidv4();
        await client.query('INSERT INTO tokens(user_id, token) values ($1, $2)', [userId, newToken]);
        return newToken;
    }

    async check(token: string): Promise<TokenData | undefined> {
        const relatedUsers: QueryResult = await client.query(
            'SELECT users.id, users.email, users.isadmin, users.company_id, users.company_admin, tokens.token FROM users LEFT JOIN tokens ON tokens.user_id = users.id WHERE token = $1',
            [token]
        );
        if (relatedUsers.rows.length) {
            const relatedUser = {
                id: relatedUsers.rows[0].id,
                email: relatedUsers.rows[0].email,
                isadmin: relatedUsers.rows[0].isadmin,
                companyId: relatedUsers.rows[0].company_id,
                companyAdmin: relatedUsers.rows[0].company_admin,
                token: relatedUsers.rows[0].token
            };
            return relatedUser;
        } else {
            return undefined
        }
    }

    async delete(token: string): Promise<void> {
        await client.query('DELETE FROM tokens WHERE token = $1', [token])
    }

    // TODO. Почитать про статические функции !!!!!! ГОТОВО!
    static initialize() {
        if (!tokenService) {
            tokenService = new TokenService();
        }
    }

}

export let tokenService: TokenService;