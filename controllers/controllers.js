import validateUserInput from '../middleware/validation.js';
import { validationResult, matchedData } from 'express-validator';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import userModel from '../services/userModel.js';
import fileModel from '../services/fileModel.js';
import folderModel from '../services/folderModel.js';
import prettyBytes from 'pretty-bytes';

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

const filesGet = async (req, res) => {
  const { id } = req.user;
  const userFiles = await fileModel.findAllFiles(id);
  const files = userFiles.map((file) => {
    return {
      ...file,
      fileSize: prettyBytes(file.fileSize),
      uploadDate: file.uploadDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  });
  res.render('files', { files });
  console.log(files);
};

const foldersGet = async (req, res) => {
  const { id } = req.user;
  const folders = await folderModel.findAllFolders(id);
  console.log(folders);
  res.render('folders', { folders });
};

const createFolderPost = async (req, res) => {
  const userId = req.user.id;
  const folderName = req.body.folderName;
  await folderModel.createFolder(folderName, userId);
  res.redirect('/folders');
};

export default { login, registerGet, registerPost, uploadPost, filesGet, createFolderPost, foldersGet };
