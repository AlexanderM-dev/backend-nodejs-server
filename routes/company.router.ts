import { Router } from 'express';

import { getCompanyList, getCompanyById } from '../controllers/company.controller';
import { tokenCheck } from '../middleware/token.check';
import { appAdminCheck } from '../middleware/admin.check';

export const companyRouter = Router();

companyRouter.get('/', tokenCheck, appAdminCheck, getCompanyList);
companyRouter.get('/:companyId', tokenCheck, getCompanyById);