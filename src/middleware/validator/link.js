import { body } from "express-validator";

export const createLinkValidator = [
  body("link")
    .exists()
    .withMessage("is required")
    .bail()
    .isURL()
    .withMessage("link is invalid"),
];
