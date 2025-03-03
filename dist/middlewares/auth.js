import jwt from 'jsonwebtoken';


export function authenticateToken(req, res, next) {
  const token = req.cookies?.token?.token; 

  console.log('token: ', token)

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.JWT_Secret_Key, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }
    req.user = user;
    next();
  });
}