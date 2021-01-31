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

export async function getCompanyById(req: Request, res: Response) {
    const { companyId } = req.params;
    if (+companyId) {
        try {
            const company: ICompany | undefined = await CompaniesDB.findByCompanyId(companyId);
            if (company) {
                res.status(200).json(company);
            } else {
                console.log('Компании в базе данных нет');
                res.status(404).json({
                    message: 'Компания не найдена'
                });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                message: 'Ошибка сервера. getCompanyById'
            })
        }
    } else {
        console.log('В запросе не корректный id компании');
        res.status(404).json({
            message: 'Компания не найдена'
        })
    }

}