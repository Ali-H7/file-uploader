import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import auth from './lib/auth.js';
import flash from 'connect-flash';
import controllers from './controllers/controllers.js';
import middlewares from './middlewares/middlewares.js';
import { upload } from './lib/cloudinary.js';
const __dirname = import.meta.dirname;

const app = express();

// Settings
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Auth
app.use(auth.appSession);
app.use(auth.passport.session());
app.use(auth.setCurrentUser);
app.use(flash());

// routes
app.get('/', [
  middlewares.isLoggedIn,
  (req, res) => {
    res.render('index');
  },
]);
app.get('/login', controllers.login);

app.get('/files', [middlewares.isLoggedIn, controllers.filesGet]);
app.post('/share-file/:id', [middlewares.isLoggedIn, controllers.shareFile]);
app.get('/file/share/:cloudinaryId', controllers.sharedFile);
app.post('/delete-file/:id', controllers.deleteFile);
app.post('/delete-share-file/:id', controllers.deleteFileShare);

app.get('/folders', [middlewares.isLoggedIn, controllers.foldersGet]);
app.get('/folder/:urlId', [middlewares.isLoggedIn, controllers.folderGet]);
app.post('/create-folder', [middlewares.isLoggedIn, controllers.createFolderPost]);
app.post('/modify-folder/:urlId', [middlewares.isLoggedIn, controllers.modifyFolderPost]);
app.get('/shared-folder/:id', controllers.sharedFolder);
app.post('/share-folder/:id', [middlewares.isLoggedIn, controllers.shareFolder]);
app.post('/delete-share-folder/:id', controllers.deleteFolderShare);

app.get('/register', controllers.registerGet);
app.post('/register', [middlewares.validateUserInput, controllers.registerPost]);

app.post('/upload', [middlewares.isLoggedIn, upload.array('uploadedFiles'), controllers.uploadPost]);

app.get('/my-shares', [middlewares.isLoggedIn, controllers.myShares]);

app.post('/login', [middlewares.normalizeLoginInput, auth.login]);
app.get('/logout', auth.logout);

// errors
app.use(controllers.handleNonExistentPages);
app.use(controllers.handleErrors);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app - listening on port ${PORT}!`);
});
