import { body } from "express-validator";
import User from "../../database/model/User";
import { async } from "regenerator-runtime";
import { Op } from "sequelize";

export const loginValidator = [
  // check email format
  body("identifier")
    .exists()
    .withMessage("is required")
    .custom(async function (identifier) {
      console.log(identifier);
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: identifier }, { email: identifier }],
        },
      });
      if (!user) {
        throw new Error("Not registered");
      }
    }),
];

export const registerValidator = [
  body("username")
    .exists()
    .isLength({ min: 4 })
    .withMessage("must be at least 4 characters")
    .custom(async (value) => {
      const user = await User.findOne({
        attributes: ["username"],
        where: {
          username: value,
        },
      });
      console.log(user);
      if (user) {
        throw new Error("User already exist");
      }
    }),
  body("email")
    .exists()
    .isEmail()
    .withMessage("please put a valid email")
    .custom(async (value) => {
      const user = await User.findOne({
        attributes: ["email"],
        where: {
          email: value,
        },
      });
      if (user) {
        throw new Error("Email is already being used");
      }
    }),
];
