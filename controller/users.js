const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const createFolderIsExist = require("../helpers/create-dir");
const { HttpCode } = require("../helpers/constants");
const EmailService = require("../services/email");
// const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const register = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        data: "Conflict",
        message: "Email is already in use",
      });
    }

    const verificationToken = nanoid();
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(verificationToken, email, name);

    const newUser = await Users.create({
      ...req.body,
      verify: false,
      verificationToken,
    });
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        data: "Unauthorized",
        message: "Invalid credentials",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const currentUser = async (req, res, next) => {
  try {
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        id: req.user._id,
        email: req.user.email,
        subscription: req.user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user._id;
    const subscription = req.body.subscription;
    await Users.updateSub(id, subscription);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        id,
        email: req.user.email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user._id;
    const avatarURL = await saveAvatarToStatic(req);
    await Users.updateAvatar(id, avatarURL);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async (req) => {
  const id = req.user._id;
  const PUBLIC_DIR = process.env.PUBLIC_DIR;
  const AVATARS_OF_USERS = path.join(PUBLIC_DIR, process.env.AVATARS_OF_USERS);
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id));
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar));
  const avatarURL = path.normalize(path.join(id, newNameAvatar));
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarURL)
    );
  } catch (error) {
    console.log(error.message);
  }
  return avatarURL;
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findbyVerifyToken(req.params.verificationToken);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification successful!",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      data: "Not found",
      message: "User not found",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
  updateSubscription,
  avatars,
  verify,
};
