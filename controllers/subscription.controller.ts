import { Request, Response } from 'express'

import { SubscriptionDB } from '../classes/subscriptions.class'
import { IRequest } from '../common';
import { ISubscription } from '../models/subscription.model';

export async function addSubscription(req: Request, res: Response) {
    const { startDate, endDate, companyId, productId } = req.body;
    if (startDate < endDate) {
        try {
            const findSubscription: ISubscription | undefined = await SubscriptionDB.find(companyId, productId);
            if (findSubscription) {
                console.log('Подписка данного продукта для данной компании уже оформлена');
                res.status(409).json({
                    message: 'Подписка данного продукта для данной компании уже оформлена'
                })
            } else {
                await SubscriptionDB.add(startDate, endDate, companyId, productId)
                res.status(201).json({
                    message: 'Подписка создана'
                })
            }
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Ошибка сервера. addSubscription'
            })
        }
    } else {
        console.log('Дата окончания подписки должна быть после её начала');
        res.status(400).json({
            message: 'Дата окончания подписки должна быть после её начала'
        })
    }
}

export async function changeSubscription(req: Request, res: Response) {
    const { startDate, endDate } = req.body;
    const { id } = req.params;
    if (startDate < endDate) {
        if (+id) {
            try {
                const findSubscription: ISubscription | undefined = await SubscriptionDB.findById(id);
                if (findSubscription) {
                    await SubscriptionDB.update(startDate, endDate, id);
                    res.status(200).json({
                        message: 'Подписка обновлена'
                    })
                } else {
                    console.log('Попытка изменить несуществующую в базе подписку');
                    res.status(404).json({
                        message: 'Подписка не найдена'
                    })
                }
            } catch (error) {
                console.error(error.message)
                res.status(500).json({
                    message: 'Ошибка сервера. changeSubscription'
                })
            }
        } else {
            console.log('В запросе не корректный id подписки');
            res.status(404).json({
                message: 'Подписка не найдена'
            })
        }
    } else {
        console.log('Дата окончания подписки должна быть после её начала');
        res.status(400).json({
            message: 'Дата окончания подписки должна быть после её начала'
        })
    }
}

export async function deleteSubscription(req: Request, res: Response) {
    const { id } = req.params;
    if (+id) {
        try {
            const findSubscription: ISubscription | undefined = await SubscriptionDB.findById(id);
            if (findSubscription) {
                await SubscriptionDB.delete(id)
                res.status(200).json({
                    message: 'Подписка удалена'
                })
            } else {
                console.log('Попытка удалить несуществующую в базе подписку');
                res.status(404).json({
                    message: 'Подписка не найдена'
                })
            }
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Ошибка сервера. deleteSubscription'
            })
        }
    } else {
        console.log('В запросе не корректный id подписки');
        res.status(404).json({
            message: 'Подписка не найдена'
        })
    }
}

export async function checkSubscription(req: Request, res: Response) {
    const { productId } = req.body;
    const typedReq = req as IRequest;
    const companyId: string | undefined = typedReq.user.companyId;
    if (companyId) {
        try {
            const endDate: Date | undefined = await SubscriptionDB.checkEndDate(productId, companyId)
            if (endDate) {
                const thisSubscriptionActive: ISubscription[] | undefined = await SubscriptionDB.checkActive(productId, companyId)
                if (thisSubscriptionActive) {
                    res.status(200).json({
                        active: true,
                        activeUntil: endDate
                     })
                } else {
                    console.log('Действующая подписка для данного продукта у данной компании не найдена');
                    res.status(404).json({
                        active: false,
                        wasActiveUntill: endDate
                    })
                }
            } else {
                console.log('Подписка для данного продукта у данной компании не найдена');
                res.status(404).json({
                    message: 'Подписка для данного продукта не найдена'
                })
            }
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Ошибка сервера. checkSubscription'
            })
        }
    }
}