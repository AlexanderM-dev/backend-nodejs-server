import { Request, Response, NextFunction } from 'express'

import { IRequest } from '../common'

export function appAdminCheck (req: Request, res: Response, next: NextFunction) {
 const typedReq = req as IRequest;

 if (typedReq.user.isadmin === true) {
    next()
 } else {
    res.status(403).json({
         message: 'Запрещено (не уполномочен)'
    })
 }
}