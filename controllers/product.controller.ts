import { Request, Response } from 'express'

import { ProductsDB } from '../classes/products.class'
import { IProduct } from '../models/product.model';

export async function addProduct(req: Request, res: Response) {
    const { name } = req.body;
    try {
        const findProduct: IProduct | undefined = await ProductsDB.findByName(name);
        if (findProduct) {
            console.log('Был введен продукт с уже существующим в базе именем');
            res.status(409).json({
                message: 'Продукт с таким именем уже создан'
            })
        } else {
            await ProductsDB.add(name);
            res.status(201).json({
                message: 'Новый продукт создан'
            })
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: 'Ошибка сервера. addProduct'
        })
    }
}

export async function changeProduct(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = req.params;
    if (+id) {
        try {
            const findProductName: IProduct | undefined = await ProductsDB.findByName(name);
            if (!findProductName) {
                const findProduct: IProduct | undefined = await ProductsDB.findById(id);
                if (findProduct) {
                    await ProductsDB.update(name, id)
                    res.status(200).json({
                        message: 'Продукт обновлен'
                    })
                } else {
                    console.log('Попытка изменить несуществующий в базе продукт');
                    res.status(404).json({
                        message: 'Продукт не найден'
                    })
                }
            } else {
                console.log('Был введен продукт с уже существующим в базе именем');
                res.status(409).json({
                    message: 'Продукт с таким именем уже создан'
                })
            }
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Ошибка сервера. changeProduct'
            })
        }
    } else {
        console.log('В запросе не корректный id продукта');
        res.status(404).json({
            message: 'Продукт не найден'
        })
    }
}

export async function deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    if (+id) {
        try {
            const findProduct: IProduct | undefined = await ProductsDB.findById(id);
            if (findProduct) {
                await ProductsDB.delete(id)
                res.status(200).json({
                    message: 'Продукт удалён'
                })
            } else {
                console.log('Попытка удалить несуществующий в базе продукт');
                res.status(404).json({
                    message: 'Продукт не найден'
                })
            }
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Ошибка сервера. deleteProduct'
            })
        }
    } else {
        console.log('В запросе не корректный id продукта');
        res.status(404).json({
            message: 'Продукт не найден'
        })
    }
}

export async function getProductList(req: Request, res: Response) {
    try {
        const allProducts: IProduct[] | undefined = await ProductsDB.getAll();
        if (allProducts) {
            res.status(200).json({ allProducts })
        } else {
            console.log('Продуктов в базе данных нет');
            res.status(404).json({
                message: 'Продуктов в базе данных нет'
            });
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: 'Ошибка сервера. getProductList'
        })
    }
}