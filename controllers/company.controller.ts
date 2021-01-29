import { Request, Response } from 'express'

import { CompaniesDB } from '../classes/companies.class'
import { ICompany } from '../models/company.model';

export async function getCompanyList(req: Request, res: Response) {
    try {
        const allCompanies: ICompany[] | undefined = await CompaniesDB.getAll();
        if (allCompanies) {
            res.status(200).json({ allCompanies })
        } else {
            console.log('Компаний в базе данных нет');
            res.status(404).json({
                message: 'Компаний в базе данных нет'
            });
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: 'Ошибка сервера. getCompanyList'
        })
    }
}