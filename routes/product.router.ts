import { Router } from 'express';

import { addProduct, changeProduct, deleteProduct, getProductList, getProductListForUser } from '../controllers/product.controller';
import { tokenCheck } from '../middleware/token.check';
import { appAdminCheck } from '../middleware/admin.check';
import { companyAdminCheck } from '../middleware/company.admin.check';
import { productValidator, allValidationResult } from '../middleware/validators';

export const productRouter = Router();

productRouter.get('/', tokenCheck, companyAdminCheck, getProductList);
productRouter.get('/user', tokenCheck, getProductListForUser);
productRouter.post('/', tokenCheck, appAdminCheck, productValidator, allValidationResult, addProduct);
productRouter.put('/:id', tokenCheck, appAdminCheck, productValidator, allValidationResult, changeProduct);
productRouter.delete('/:id', tokenCheck, appAdminCheck, deleteProduct);