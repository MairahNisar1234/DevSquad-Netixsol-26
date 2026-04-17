export const allowRoles = (...roles) => {
  return (req, res, next) => {
    // 1. Safety Check: Ensure the user object exists
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 2. Role Check: Ensure the user has the required role
    if (!roles.includes(req.user.role)) {
      console.error(`Security Alert: User ${req.user.id} with role '${req.user.role}' attempted to access a restricted route.`);
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }

    // 3. Success
    next();
  };
};