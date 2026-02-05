import { validationResult, matchedData } from 'express-validator';
import userModel from '../services/userModel.js';
import fileModel from '../services/fileModel.js';
import folderModel from '../services/folderModel.js';
import fileSharesModel from '../services/fileSharesModel.js';
import folderSharesModel from '../services/folderSharesModel.js';
import helpers from '../helpers/helpers.js';
import { cloudinary } from '../lib/cloudinary.js';

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
  console.log(folders);
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
  const folderUrlId = req.params.urlId;
  const userFiles = await fileModel.findAllFiles(userId);
  const userFolder = await folderModel.findFolderContent(userId, folderUrlId);
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
  const userId = req.user.id;
  const folderUrlId = req.params.urlId;
  const { selectedFiles } = req.body;
  const filesId =
    selectedFiles === undefined
      ? []
      : !Array.isArray(selectedFiles)
        ? [Number(selectedFiles)]
        : selectedFiles.map((fileId) => Number(fileId));
  const folder = await folderModel.findFolderContent(userId, folderUrlId);
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
    await folderModel.updateFolder(folderUrlId, userId, addFiles, deleteFiles);
  }
  res.redirect(`/folder/${folderUrlId}`);
};

const shareFile = async (req, res) => {
  const userId = req.user.id;
  const fileId = Number(req.params.id);
  const { duration } = req.body;
  const date = helpers.createDateObject(duration);
  const shareId = await fileSharesModel.createFileShare(userId, fileId, date);
  res.redirect(`/file/${shareId}`);
};

const sharedFile = async (req, res) => {
  const shareId = `share/${req.params.cloudinaryId}`;
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  let share = await fileSharesModel.findFileShare(shareId);
  share = share && helpers.formatFileShare(share, url);
  if (!share || !share.status) return res.redirect('/404');
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
  const urlId = req.params.urlId;
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  let share = await folderSharesModel.findFolderShare(urlId);
  share = helpers.formatFileShare(share, url);
  res.render('shared-folder', { share });
};

function handleNonExistentPages(req, res) {
  res.render('error-page', { error: null });
}

function handleErrors(err, req, res, next) {
  console.error(err);
  res.render('error-page', { error: err.message });
}

const deleteFile = async (req, res) => {
  const userId = req.user.id;
  const fileId = Number(req.params.id);
  const cloudinaryId = await fileModel.deleteFile(fileId, userId);
  await cloudinary.uploader.destroy(cloudinaryId);
  res.redirect(`/files`);
};

const deleteFileShare = async (req, res) => {
  const userId = req.user.id;
  const shareId = Number(req.params.id);
  await fileSharesModel.deleteFileShare(userId, shareId);
  res.redirect(`/my-shares`);
};

const deleteFolderShare = async (req, res) => {
  const userId = req.user.id;
  const shareId = Number(req.params.id);
  await folderSharesModel.deleteFolderShare(userId, shareId);
  res.redirect(`/my-shares`);
};

const deleteFolder = async (req, res) => {
  const userId = req.user.id;
  const folderId = Number(req.params.id);
  await folderModel.deleteFolder(userId, folderId);
  res.redirect(`/folders`);
};

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
  deleteFile,
  deleteFileShare,
  deleteFolderShare,
  deleteFolder,
};
