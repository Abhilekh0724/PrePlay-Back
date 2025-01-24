const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '3650d' } // Token expires in 1 year
  );
};

const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: 'Authorization header not found!',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    return res.status(400).json({
      success: false,
      message: 'Token is missing!',
    });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    console.log('Decoded User:', decodedUser);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
        expiredAt: error.expiredAt,
      });
    }
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Not Authenticated',
    });
  }
};

const adminGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: 'Authorization header not found!',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    return res.status(400).json({
      success: false,
      message: 'Token is missing!',
    });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;

    if (!req.user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Permission Denied!',
      });
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
        expiredAt: error.expiredAt,
      });
    }
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Not Authenticated',
    });
  }
};

module.exports = {
  generateToken, // Export generateToken
  authGuard,
  adminGuard,
};
