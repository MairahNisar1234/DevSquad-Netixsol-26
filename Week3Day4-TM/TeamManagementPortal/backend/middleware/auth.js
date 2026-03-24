import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
  // Expect token as: Authorization: Bearer <token>
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Access Denied: No token provided' });

  const token = authHeader.split(' ')[1]; // get token after "Bearer"
  if (!token) return res.status(401).json({ message: 'Access Denied: Invalid token format' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // attach payload to request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token', error: err.message });
  }
};

export default auth;