import { QueryResult } from 'pg';

import { client } from '../index'
import { IProduct } from '../models/product.model';

export class ProductsDB {
    constructor() {}

    static async getAll(): Promise<IProduct[] | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM products')
        if (qr.rows.length) {
            return qr.rows
        } else return undefined
    }

    static async add(name: string): Promise<void> {
        await client.query('INSERT INTO products(name) VALUES ($1)', [name])
    }

    static async findByName(name: string): Promise<IProduct | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM products WHERE name = $1', [name])
        if (qr.rows.length) {
            return qr.rows[0]
        } else return undefined
    }

    static async findById(id: string): Promise<IProduct | undefined> {
        const qr: QueryResult = await client.query('SELECT * FROM products WHERE id = $1', [id])
        if (qr.rows.length) {
            return qr.rows[0]
        } else return undefined
    }

    static async update(name: string, id: string): Promise<void> {
        await client.query('UPDATE products SET name = $1 WHERE id=$2', [name, id])
    }

    static async delete(id: string): Promise<void> {
        await client.query('DELETE FROM products WHERE id=$1', [id])
    }
}