const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'xo_jwt_secret',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'xo_refresh_secret',
    { expiresIn: '7d' }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
