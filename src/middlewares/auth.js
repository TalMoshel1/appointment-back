import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  if (!req.cookies?.token) {
    return res.status(401).json({ message: 'Token is missing' });
  }
  const {token} = req.cookies?.token

  jwt.verify(token, process.env.JWT_Secret_Key, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }else{
      console.log('user role: ', user.role)
      next()
    }})

}

