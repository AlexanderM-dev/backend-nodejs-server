import { Router } from 'express';

import { addSubscription, changeSubscription, deleteSubscription, checkSubscription } from '../controllers/subscription.controller';
import { tokenCheck } from '../middleware/token.check';
import { appAdminCheck } from '../middleware/admin.check';
import { subscriptionValidator, updSubscriptionValidator, allValidationResult, checkSubscriptionValidator} from '../middleware/validators';

export const subscriptionRouter = Router();

subscriptionRouter.post('/', tokenCheck, appAdminCheck, subscriptionValidator, allValidationResult, addSubscription);
subscriptionRouter.put('/:id', tokenCheck, appAdminCheck, updSubscriptionValidator, allValidationResult, changeSubscription);
subscriptionRouter.delete('/:id', tokenCheck, appAdminCheck, deleteSubscription);
subscriptionRouter.get('/', tokenCheck, checkSubscriptionValidator, checkSubscription) 