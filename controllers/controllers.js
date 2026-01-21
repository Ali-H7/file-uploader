import validateUserInput from '../middleware/validation.js';
import { validationResult, matchedData } from 'express-validator';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import userModel from '../services/userModel.js';
import fileModel from '../services/fileModel.js';

const login = (req, res) => {
  if (req.user) return res.redirect('/');
  const loginErrorMsg = req.session.messages ? req.session.messages.shift() : null;
  res.render('login', { loginErrorMsg });
};

const registerGet = (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('register', { userInput: {}, errors: [] });
};

const registerPost = [
  validateUserInput,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { body: userInput } = req;
      res.render('register', { userInput, errors: errors.array({ onlyFirstError: true }) });
    } else {
      const userObject = matchedData(req);
      await userModel.createUser(userObject);
      res.redirect('/login');
    }
  },
];

const uploadPost = [
  upload.array('uploadedFiles'),
  async (req, res) => {
    const { id } = req.user;
    const { files } = req;
    await fileModel.addFiles(files, id);
    res.redirect('/');
  },
];

export default { login, registerGet, registerPost, uploadPost };
