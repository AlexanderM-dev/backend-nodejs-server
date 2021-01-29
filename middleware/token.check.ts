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
                // TODO. В объектах JS не должно быть подчеркиваний (company_admin -> companyAdmin), но в БД остается как было. (везде проверить) !!!!!!!! ГОТОВО
                companyAdmin: thisUserObj.companyAdmin,
                token: thisUserObj.token
            };
            next();
        } else {
            // TODO. Любые ошибки и предупреждения в деталях должны логироваться в консоль (везде проверить) !!!!!!!!!! ГОТОВО
            console.log("Токен не найден в БД");
            res.status(403).json({
                message: 'Ошибка аутентификации'
            })
        }
    } else {
            // TODO. Привести к единообразию формат возвращаемых ошибок (везде)                                                        !!!!!!!!!! ГОТОВО
            //      В ошибке не должно быть секретной внутренней информации, в тоже время в логах информация должна быть подробной.    !!!!!!!!!! ГОТОВО
        console.log('Токен отсутсвует в запросе');
        res.status(403).json({
            message: 'Ошибка аутентификации'
        })
    }
}