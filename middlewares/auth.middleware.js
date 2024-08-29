const { verify } = require("jsonwebtoken");
const { User } = require("../models");

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header is missing',
    });
  }

  try {
    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token type',
      });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });
    req.user = user; // Attach decoded user to request object
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Please login first',
    });
  }
};

module.exports = auth;