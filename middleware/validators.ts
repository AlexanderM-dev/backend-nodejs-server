import { Request, Response, NextFunction } from 'express'
import { check, validationResult } from 'express-validator';

export const allValidationResult = (req: Request, res: Response, next: NextFunction): Response<any> | void => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const error = result.array()[0].msg;
        return res.status(422).json({ message: 'Ошибка в введённых данных, проверьте ещё раз' })
    } else next()
};

export const userRegisterValidator = [
    check('name')
        .trim()
        .not().isEmpty()
        .withMessage('Name is required!')
        .isLength({ min: 2, max: 20 })
        .withMessage('Name must be 2 to 20 characters long!'),
    check('surname')
        .trim()
        .not().isEmpty()
        .withMessage('Surname is required!')
        .isLength({ min: 2, max: 20 })
        .withMessage('Surname must be 2 to 20 characters long!'),
    check('email')
        .trim()
        .not().isEmpty()
        .withMessage('Email is required!!')
        .isEmail()
        .withMessage('Please provide a valid email!'),
    check('password')
        .trim()
        .not().isEmpty()
        .withMessage('Password is required!!')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long!')
]

export const userLoginValidator = [
    check('email')
        .trim()
        .not().isEmpty()
        .withMessage('Email is required!!')
        .isEmail()
        .withMessage('Please provide a valid email!'),
    check('password')
        .trim()
        .not().isEmpty()
        .withMessage('Password is required!!')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long!')
]


export const companyRegisterValidator = [
    check('companyName')
        .trim()
        .not().isEmpty()
        .withMessage('Company name is required!')
        .isLength({ min: 2 })
        .withMessage('Company name must be at least 2 characters long!'),
    check('companyInn')
        .trim()
        .not().isEmpty()
        .withMessage('Company Inn is required!')
        .isLength({ min: 7, max: 7 })
        .withMessage('Company Inn must be 7 characters long!')
]

export const productValidator = [
    check('name')
        .trim()
        .not().isEmpty()
        .withMessage('Product name is required!')
        .isLength({ min: 2 })
        .withMessage('Product name must be at least 2 characters long!')
]

export const subscriptionValidator = [
    check('startDate')
        .trim()
        .not().isEmpty()
        .withMessage('Start date is required!')
        .isLength({min: 10, max: 10})
        .withMessage('Must be a valid format of Start date!')
        .isDate()
        .withMessage('Must be a Date format (YYYY-MM-DD)'),
    check('endDate')
        .trim()
        .not().isEmpty()
        .withMessage('Start date is required!')
        .isLength({min: 10, max: 10})
        .withMessage('Must be a valid format of End date!')
        .isDate()
        .withMessage('Must be a Date format (YYYY-MM-DD)'),
    check('companyId')
        .trim()
        .not().isEmpty()
        .withMessage('Company Id is required!')
        .isNumeric({no_symbols: true})
        .withMessage('Company Id must be numeric'),
    check('productId')
        .trim()
        .not().isEmpty()
        .withMessage('Product Id is required!')
        .isNumeric({no_symbols: true})
        .withMessage('Product Id must be numeric')
]

export const updSubscriptionValidator = [
    check('startDate')
        .trim()
        .not().isEmpty()
        .withMessage('Start date is required!')
        .isLength({min: 10, max: 10})
        .withMessage('Must be a valid format of Start date!')
        .isDate()
        .withMessage('Must be a Date format (YYYY-MM-DD)'),
    check('endDate')
        .trim()
        .not().isEmpty()
        .withMessage('Start date is required!')
        .isLength({min: 10, max: 10})
        .withMessage('Must be a valid format of End date!')
        .isDate()
        .withMessage('Must be a Date format (YYYY-MM-DD)')
]

export const checkSubscriptionValidator = [
    check('productId')
        .trim()
        .not().isEmpty()
        .withMessage('Product Id is required!')
        .isNumeric({no_symbols: true})
        .withMessage('Product Id must be numeric')
]