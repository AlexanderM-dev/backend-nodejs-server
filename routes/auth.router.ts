import { Router } from 'express';

import { login, register, logout, registerUser, renameAppAdmin } from '../controllers/auth.controller';
import { tokenCheck } from '../middleware/token.check';
import { appAdminCheck } from '../middleware/admin.check';
import { companyAdminCheck } from '../middleware/company.admin.check';
import { allValidationResult, userRegisterValidator, companyRegisterValidator, userLoginValidator } from '../middleware/validators';

export const authRouter = Router();

authRouter.post('/login', userLoginValidator, allValidationResult, login);
authRouter.put('/renameappadmin', tokenCheck, appAdminCheck, userRegisterValidator, companyRegisterValidator, allValidationResult, renameAppAdmin);
authRouter.post('/logout', tokenCheck, logout);
authRouter.post('/register', userRegisterValidator, companyRegisterValidator, allValidationResult, register);
authRouter.post('/registerUser', tokenCheck, userRegisterValidator, allValidationResult, companyAdminCheck, registerUser);
