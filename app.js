import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import auth from './lib/auth.js';
import controllers from './controllers/controllers.js';
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

// routes
app.get('/', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('index');
});
app.get('/login', controllers.login);

app.get('/files', controllers.filesGet);

app.get('/register', controllers.registerGet);
app.post('/register', controllers.registerPost);

app.post('/upload', controllers.uploadPost);

app.post('/login', auth.login);
app.get('/logout', auth.logout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app - listening on port ${PORT}!`);
});
