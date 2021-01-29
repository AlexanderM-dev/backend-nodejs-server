import { Request } from 'express'
import { IUser } from './models/user.model';

export interface IRequest<T = any> extends Request {
    body: T
    user: Pick<IUser, 'id' | 'email' | 'isadmin' | 'companyAdmin' | 'companyId'>;
}