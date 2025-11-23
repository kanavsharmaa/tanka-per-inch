import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/changePassword").post(verifyJWT, changePassword);
router.route("/logout").get(verifyJWT, logoutUser);

export default router;
