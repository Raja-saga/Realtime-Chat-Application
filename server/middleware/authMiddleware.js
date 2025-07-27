export default function authMiddleware(req, res, next) {
    console.log('authMiddleware working');
    next();
  }
  