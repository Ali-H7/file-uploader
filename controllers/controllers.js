const login = (req, res) => {
  const loginErrorMsg = req.session.messages ? req.session.messages.shift() : null;
  res.render('login', { loginErrorMsg });
};

export default { login };
