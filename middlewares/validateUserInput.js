import { body } from 'express-validator';
import userModel from '../services/userModel.js';

const validateUserInput = [
  body('firstName')
    .trim()
    .exists()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .exists()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .toLowerCase()
    .exists()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Please enter a valid email e.g: email@gmail.com')
    .bail()
    .custom(async (email) => {
      const doesEmailExist = await userModel.findByEmail(email);
      if (doesEmailExist) {
        throw new Error('E-mail already in use');
      }
    }),
  body('password')
    .exists()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage(
      'Password should be a minimum of 8 characters ,and contain at least one uppercase, one lowercase, one number, and one special character.',
    ),
];

export default validateUserInput;
