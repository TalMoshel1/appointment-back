import jwt from "jsonwebtoken";
import { getUserRoleByUserId } from '../services/users.js'

export function authenticateToken(req, res, next) {
  console.log('?')
  if (!req.cookies?.token) {
    return res.status(401).json({ code: 401, message: "Token is missing" });
  }
  const { token } = req.cookies?.token;

  jwt.verify(token, process.env.JWT_Secret_Key, async (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ code: 403, message: "Token is invalid or expired" });
    }

    const userRole = await getUserRoleByUserId(user.userId);

    if (userRole !== "admin") {
      console.log('!')
      return res
        .status(403)
        .json({ message: "Unauthorized: Insufficient role" });
    } else {
      console.log('?')
      next();
    }
  });
}
