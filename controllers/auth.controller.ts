import { Request, Response } from 'express'

import { client } from '../index'
import { IRequest } from '../common';
import { tokenService } from '../classes/tokenservice.class'
import { CompaniesDB } from '../classes/companies.class'
import { UsersDB } from '../classes/users.class'
import { IUser } from '../models/user.model';
import { ICompany } from '../models/company.model';

interface ILoginBody {
   email: string;
   password: string;
}

export async function login(req: Request, res: Response) {
   const typedReq = req as IRequest<ILoginBody>;
   // TODO. В самом конце, когда все будет готово, надо изучить и применить валидаторы и санитайзеры данных (экспресс валидатор)
   const { email, password } = typedReq.body;
   try {
      // TODO. Добавить класс и методы работы с пользователями (например, класс со статическими функциями) чтобы убрать все запросы отсюда.
      //       По идее в контроллере не должно быть никакой связи с логикой БД, т.к. контроллер может выполнять роуты при различных БД.        !!!!!!!!! ГОТОВО
      const candidate: IUser | undefined = await UsersDB.findByEmail(email)
      if (candidate) {
         // TODO. В БД не должны хранитья пароли в открытом виде                                                                               !!!!!!!!! ГОТОВО
         const candidatePass: IUser | undefined = await UsersDB.findByEmailAndPassword(password, email)
         if (candidatePass) {
            // Генерация токена, пароли совпали
            const token: string = await tokenService.create(candidatePass.id)
            res.status(200).json({
               token: token,
               companyAdmin: candidatePass.companyAdmin,
               isAdmin: candidatePass.isadmin
            })
         } else {
            console.log('Пользователь ввёл не правильный пароль');
            res.status(401).json({
               message: 'Не правильный пароль, попробуйте ещё раз'
            })
         }
      } else {
         console.log('Пользователь с таким Email не найден');
         res.status(404).json({
            message: 'Пользователь с таким Email не найден'
         })
      }
   } catch (error) {
      console.error(error.message)
      res.status(500).json({
         message: 'Ошибка сервера. Login'
      })
   }
}

export async function register(req: Request, res: Response) {
   const { email, password, surname, name, companyName, companyInn } = req.body;
   try {
      await client.query('BEGIN');
      const candidateUser: IUser | undefined = await UsersDB.findByEmail(email);
      const candidateCompany: ICompany | undefined = await CompaniesDB.findByCompanyInn(companyInn);
      await client.query('COMMIT');
      if (candidateUser) {
         console.log('Пользователь ввёл уже существующий email при попытке регистрации');
         res.status(409).json({
            message: 'Такой email уже используется'
         })
      } else if (candidateCompany) {
         console.log('Пользователь ввёл уже существующий ИНН компании при попытке регистрации');
         res.status(409).json({
            message: 'Такая компания уже создана'
         })
      } else {
         await client.query('BEGIN');
         // TODO. Один запрос сделать !!!!!!!! ГОТОВО
         try {
            const companyId: string = await CompaniesDB.registerAndReturnCompanyId(companyName, companyInn)
            UsersDB.registerCompanyAdmin(email, password, companyId, surname, name)
            await client.query('COMMIT');
            res.status(201).json({
               message: 'Регистрация компании и её администратора прошла успешно'
            })
         } catch (error) {
            console.error(error.message);
            await client.query('ROLLBACK');
         }

      }
   } catch (error) {
      console.error(error.message)
      res.status(500).json({
         message: 'Ошибка сервера. Register'
      })
   }
}

export async function logout(req: Request, res: Response) {
   try {
      if (req.headers.authorization) {
         await tokenService.delete(req.headers.authorization);
         res.sendStatus(200);
      } else {
         // TODO. Тут точно не 500 !!!! ГОТОВО поправил на 403
         console.log('Токен отсутсвует в запросе');
         res.status(403).json({
            message: 'Ошибка аутентификации'
         })
      }
   } catch (error) {
      console.error(error.message);
      res.status(500).json({
         message: 'Ошибка сервера. Logout'
      })
   }
}

export async function registerUser(req: Request, res: Response) {
   const { email, password, surname, name } = req.body;
   try {
      const candidateUser: IUser | undefined = await UsersDB.findByEmail(email);
      if (candidateUser) {
         res.status(409).json({
            message: 'Такой email уже используется'
         })
      } else {
         const typedReq = req as IRequest;
         // TODO. Зачем эти запросы? пользователь уже аутентифицирован по токену. !!!!!! ГОТОВО
         const companyId: string | undefined = typedReq.user.companyId;
         if (companyId) {
            await UsersDB.registerUser(email, password, companyId, surname, name)
            res.status(201).json({
               message: 'Регистрация пользователя прошла успешно '
            })
         } else {
            console.log('У текущего пользователя нету ID компании')
         }
      }
   } catch (error) {
      console.error(error.message)
      res.status(500).json({
         err: 'Ошибка сервера. RegisterUser'
      })
   }
}
// TODO:
export async function renameAppAdmin(req: Request, res: Response) {
   const { email, password, surname, name, companyName, companyInn } = req.body;
   try {
      await client.query('BEGIN');
      const candidateUser: IUser | undefined = await UsersDB.findByEmail(email);
      const candidateCompany: ICompany | undefined = await CompaniesDB.findByCompanyInn(companyInn);
      await client.query('COMMIT');
      if (candidateUser) {
         console.log('Администратор приложения ввёл уже существующий email при попытке регистрации');
         res.status(409).json({
            message: 'Такой email уже используется'
         })
      } else if (candidateCompany) {
         console.log('Администратор приложения ввёл уже существующий ИНН компании при попытке регистрации');
         res.status(409).json({
            message: 'Такая компания уже создана'
         })
      } else {
         await client.query('BEGIN');
         try {

            const adminCompanyId: string = await CompaniesDB.updateAndReturnAdminCompanyId(companyName, companyInn)
            UsersDB.updateAppAdmin(email, password, adminCompanyId, surname, name)

            await client.query('COMMIT');
            res.status(201).json({
               message: 'Переименование компании-администратора и администратора приложения прошла успешно'
            })
         } catch (error) {
            console.error(error.message);
            await client.query('ROLLBACK');
         }

      }
   } catch (error) {
      console.error(error.message)
      res.status(500).json({
         message: 'Ошибка сервера. renameAppAdmin'
      })
   }
}