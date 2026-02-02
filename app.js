import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import auth from './lib/auth.js';
import controllers from './controllers/controllers.js';
import validateUserLogin from './middleware/validateUserLogin.js';
import flash from 'connect-flash';
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
  validateUserLogin,
  (req, res) => {
    res.render('index');
  },
]);
app.get('/login', controllers.login);

app.get('/files', [validateUserLogin, controllers.filesGet]);
app.post('/share-file/:id', [validateUserLogin, controllers.shareFile]);
app.get('/shared-file/:id', controllers.sharedFile);

app.get('/folders', [validateUserLogin, controllers.foldersGet]);
app.get('/folder/:id', [validateUserLogin, controllers.folderGet]);
app.post('/create-folder', [validateUserLogin, controllers.createFolderPost]);
app.post('/modify-folder/:id', [validateUserLogin, controllers.modifyFolderPost]);
app.get('/shared-folder/:id', controllers.sharedFolder);
app.post('/share-folder/:id', [validateUserLogin, controllers.shareFolder]);

app.get('/register', controllers.registerGet);
app.post('/register', controllers.registerPost);

app.post('/upload', [validateUserLogin, controllers.uploadPost]);

app.get('/my-shares', [validateUserLogin, controllers.myShares]);

app.post('/login', auth.login);
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
