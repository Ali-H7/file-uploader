export default function normalizeLoginInput(req, res, next) {
  req.body.email = req.body.email.trim().toLowerCase();
  next();
}
