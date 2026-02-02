import { validationResult, matchedData } from 'express-validator';
import userModel from '../services/userModel.js';
import fileModel from '../services/fileModel.js';
import folderModel from '../services/folderModel.js';
import fileSharesModel from '../services/fileSharesModel.js';
import folderSharesModel from '../services/folderSharesModel.js';
import helpers from '../helpers/helpers.js';

const login = (req, res) => {
  if (req.user) return res.redirect('/');
  const loginErrorMsg = req.flash('error')[0] ?? null;
  res.render('login', { loginErrorMsg });
};

const registerGet = (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('register', { userInput: {}, errors: [] });
};

const registerPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { body: userInput } = req;
    res.render('register', { userInput, errors: errors.array({ onlyFirstError: true }) });
  } else {
    const userObject = matchedData(req);
    await userModel.createUser(userObject);
    res.redirect('/login');
  }
};

const uploadPost = async (req, res) => {
  const { id } = req.user;
  const { files } = req;
  await fileModel.addFiles(files, id);
  console.log(files);
  res.redirect('/files');
};

const filesGet = async (req, res) => {
  const { id } = req.user;
  const userFiles = await fileModel.findAllFiles(id);
  const files = helpers.formatFiles(userFiles);
  res.render('files', { files });
};

const foldersGet = async (req, res) => {
  const { id } = req.user;
  const folders = await folderModel.findAllFolders(id);
  res.render('folders', { folders });
};

const createFolderPost = async (req, res) => {
  const userId = req.user.id;
  const folderName = req.body.folderName;
  await folderModel.createFolder(folderName, userId);
  res.redirect('/folders');
};

const folderGet = async (req, res) => {
  const userId = req.user.id;
  const folderId = Number(req.params.id);
  const userFiles = await fileModel.findAllFiles(userId);
  const userFolder = await folderModel.findFolderContent(folderId);
  const files = userFiles.map((file) => {
    return { ...file, selected: userFolder.files.map((folderFile) => folderFile.id).includes(file.id) };
  });
  const folder = {
    ...userFolder,
    files: helpers.formatFiles(userFolder.files),
  };
  res.render('folder', { folder, files });
};

const modifyFolderPost = async (req, res) => {
  const folderId = Number(req.params.id);
  const { selectedFiles } = req.body;
  const filesId =
    selectedFiles === undefined
      ? []
      : !Array.isArray(selectedFiles)
        ? [Number(selectedFiles)]
        : selectedFiles.map((fileId) => Number(fileId));
  const folder = await folderModel.findFolderContent(folderId);
  const currentFiles = folder.files.map((file) => file.id);
  const filesToAdd = filesId.filter((fileId) => !currentFiles.includes(fileId));
  const filesToDelete = currentFiles.filter((fileId) => !filesId.includes(fileId));

  if (filesToAdd.length > 0 || filesToDelete.length > 0) {
    const addFiles = filesToAdd.map((file) => {
      return { id: file };
    });
    const deleteFiles = filesToDelete.map((file) => {
      return { id: file };
    });
    await folderModel.updateFolder(folderId, addFiles, deleteFiles);
  }
  res.redirect(`/folder/${folderId}`);
};

const shareFile = async (req, res) => {
  const userId = req.user.id;
  const fileId = Number(req.params.id);
  const { duration } = req.body;
  const date = helpers.createDateObject(duration);
  const shareId = await fileSharesModel.createFileShare(userId, fileId, date);
  res.redirect(`/shared-file/${shareId}`);
};

const sharedFile = async (req, res) => {
  const shareId = Number(req.params.id);
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  let share = await fileSharesModel.findFileShare(shareId);
  share = helpers.formatFileShare(share, url);
  res.render('shared-file', { share });
};

const myShares = async (req, res) => {
  const userId = req.user.id;
  const fileShares = await fileSharesModel.findUserShares(userId);
  const folderShares = await folderSharesModel.findUserShares(userId);
  const shares = helpers.formatMyShares(fileShares, folderShares);
  res.render('my-shares', { shares });
};

const shareFolder = async (req, res) => {
  const userId = req.user.id;
  const folderId = Number(req.params.id);
  const { duration } = req.body;
  const date = helpers.createDateObject(duration);
  const shareId = await folderSharesModel.createFolderShare(userId, folderId, date);
  res.redirect(`/shared-folder/${shareId}`);
};

const sharedFolder = async (req, res) => {
  const shareId = Number(req.params.id);
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  let share = await folderSharesModel.findFolderShare(shareId);
  share = helpers.formatFileShare(share, url);
  console.log(share);
  res.render('shared-folder', { share });
};

function handleNonExistentPages(req, res) {
  res.render('error-page', { error: null });
}

function handleErrors(err, req, res, next) {
  res.render('error-page', { error: err.message });
}

export default {
  login,
  registerGet,
  registerPost,
  uploadPost,
  filesGet,
  createFolderPost,
  foldersGet,
  folderGet,
  modifyFolderPost,
  shareFile,
  sharedFile,
  myShares,
  shareFolder,
  sharedFolder,
  handleNonExistentPages,
  handleErrors,
};
