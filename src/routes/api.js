import { Router } from "express";
import { login, logout, register } from "../controllers/auth";
import {
  createLink,
  listAllLinkByUserId,
  updateLink,
} from "../controllers/link";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { body } from "express-validator";
import {
  loginValidator,
  registerValidator,
} from "../middleware/validator/auth";
import { validate } from "../middleware/validator";
import { createLinkValidator } from "../middleware/validator/link";

const apiRoutes = Router();

apiRoutes.post("/register", registerValidator, validate, register);
apiRoutes.post("/login", loginValidator, validate, login);
apiRoutes.get("/logout", logout);

apiRoutes.post(
  "/link",
  createLinkValidator,
  validate,
  isAuthenticated,
  createLink
);
apiRoutes.put("/link/:slug", isAuthenticated, updateLink);
apiRoutes.get("/link/:userId", isAuthenticated, listAllLinkByUserId);

export default apiRoutes;