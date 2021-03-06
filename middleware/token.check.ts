import { Request, Response, NextFunction } from 'express'
// Local
import { tokenService, TokenData } from '../classes/tokenservice.class'

export async function tokenCheck(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization !== undefined) {
        const thisUserObj: TokenData | undefined = await tokenService.check(req.headers.authorization);
        if (thisUserObj !== undefined) {
            req.user = {
                id: thisUserObj.id,
                email: thisUserObj.email,
                isadmin: thisUserObj.isadmin,
                companyId: thisUserObj.companyId,
                companyAdmin: thisUserObj.companyAdmin,
                token: thisUserObj.token
            };
            next();
        } else {
            console.log("Токен не найден в БД");
            res.status(403).json({
                message: 'Ошибка аутентификации'
            })
        }
    } else {
        console.log('Токен отсутсвует в запросе');
        res.status(403).json({
            message: 'Ошибка аутентификации'
        })
    }
}