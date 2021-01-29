import bcrypt from 'bcryptjs'

import { client } from '../index'


const dbVersion = "1.0.0";



export class DataBase {
    constructor() {}

    static async create() {
        const securedPassword = bcrypt.hashSync('appAdminPassword', bcrypt.genSaltSync(10));
        await client.query('BEGIN');
        await client.query('CREATE TABLE IF NOT EXISTS companies(id serial primary key NOT NULL, name varchar(255) NOT NULL, inn varchar(255) UNIQUE NOT NULL)');
        await client.query(`CREATE TABLE IF NOT EXISTS users(id serial primary key NOT NULL, email varchar(255) UNIQUE NOT NULL, password varchar(255) NOT NULL,company_id integer REFERENCES 
                            companies(id) NOT NULL, surname varchar(255) NOT NULL, name varchar(255) NOT NULL, company_admin boolean DEFAULT false, isAdmin boolean DEFAULT false)`);
        await client.query('CREATE TABLE IF NOT EXISTS products(id serial primary key, name varchar(255) UNIQUE NOT NULL)');
        await client.query(`CREATE TABLE IF NOT EXISTS company_products(company_id integer REFERENCES companies(id) NOT NULL, product_id integer REFERENCES products(id) NOT NULL, 
                            PRIMARY KEY (company_id, product_id))`);
        await client.query(`CREATE TABLE IF NOT EXISTS subscriptions(id serial PRIMARY KEY, activate_date date NOT NULL DEFAULT NOW(), start_date date NOT NULL, end_date date NOT NULL, company_id integer 
                            REFERENCES companies(id) NOT NULL, product_id integer REFERENCES products(id) NOT NULL)`);
        await client.query(`CREATE TABLE IF NOT EXISTS tokens(user_id integer references users(id) NOT NULL, token varchar(255) UNIQUE NOT NULL, logintime timestamp DEFAULT NOW(), 
                            PRIMARY KEY (user_id, token))`);
        await client.query('CREATE TABLE IF NOT EXISTS db_version(id serial primary key NOT NULL, version varchar(255) NOT NULL)');
        await client.query('INSERT INTO db_version(version) VALUES ($1)', [dbVersion]);
        await client.query(`INSERT INTO companies(name, inn) VALUES ('adminCompany', '222111222')`);
        await client.query(`INSERT INTO users(email, password, company_id, surname, name, company_admin, isadmin) VALUES ('admin@gmail.com', $1, '1', 'AdminSurname', 'AdminName', true, true)`, [securedPassword]);
        await client.query(`CREATE TABLE IF NOT EXISTS currencies(id serial PRIMARY KEY, CharCode varchar(255) NOT NULL, Name varchar(255) NOT NULL, Value numeric NOT NULL);`);
        await client.query('COMMIT');
    }
}