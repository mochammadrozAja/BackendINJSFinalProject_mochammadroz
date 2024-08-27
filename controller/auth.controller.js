const { hash, genSalt, compareSync } = require("bcrypt");
const { User } = require("../models");
const UnauthenticatedError = require("../error/UnAuthenticatedError");
const { sign } = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const {name, username, email, password, role, phoneNumber,address} = req.body;
  try {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password,salt);
    const user = await User.create({name, username, email, role, phoneNumber,address, password: hashedPassword});
    res.status(201).json({
      message: "Success creating new user",
      id: user.id, name: user.name, username: user.username, email: user.email, role: user.role, phoneNumber: user.phoneNumber,address: user.address
    });
  } catch (error) {
    next(error);
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) throw new UnauthenticatedError("Invalid username/password");

    if (!compareSync(password,user.password)) {
      throw new UnauthenticatedError("Invalid username/password");
    }

    const payload = {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id
    }
    
    const accessToken = sign(payload, process.env.JWT_SECRET);

    res.status(200).json({ accessToken, name: user.name, role: user.role, id: user.id });
  } catch (error) {
    next(error);
  }
}