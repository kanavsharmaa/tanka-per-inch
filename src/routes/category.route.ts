import { Router } from "express";
import {
  addCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addCategory").post(verifyJWT, verifyAdmin, addCategory);
router.route("/updateCategory").post(verifyJWT, verifyAdmin, updateCategory);

export default router;
