const { hash, genSalt, compareSync } = require("bcrypt");
const { User } = require("../models");
const UnauthenticatedError = require("../error/UnAuthenticatedError");
const { sign } = require("jsonwebtoken");

const hashPassword = async (password) => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

const generateToken = (user) => {
  const payload = {
    name: user.name,
    email: user.email,
    role: user.role,
    id: user.id,
  };
  return sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res, next) => {
  const { name, username, email, password, role, phoneNumber, address } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, username, email, role, phoneNumber, address, password: hashedPassword });
    res.status(201).json({
      message: "Success creating new user",
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !compareSync(password, user.password)) {
      throw new UnauthenticatedError("Invalid username/password");
    }

    const accessToken = generateToken(user);
    res.status(200).json({ accessToken, name: user.name, role: user.role, id: user.id });
  } catch (error) {
    next(error);
  }
};