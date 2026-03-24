import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Ensure the token format is "Bearer <token>"
    const bearerToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
}