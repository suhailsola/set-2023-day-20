import { Op } from "sequelize";
import User from "../../database/model/User";
import bcrypt, { hash } from "bcryptjs";

// encrypt password
function encryptedPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
}

export function register(req, res) {
  const { username, email, password } = req.body;
  const hashPassword = encryptedPassword(password);
  User.create({ username, email, password: hashPassword })
    .then(function (data) {
      res
        .status(200)
        .json({ message: "A user is created", data: data.dataValues });
    })
    .catch(function (error) {
      res.status(500).json({
        message: "An error occured",
        error: error.errors[0].message,
        type: error.errors[0].type,
      });
    });
}

export async function login(req, res) {
  const { identifier, password } = req.body;
  console.log(identifier);
  const [user] = await User.findOne({
    where: {
      [Op.or]: [{ username: identifier }, { email: identifier }],
    },
  });
  // const hashPassword = encryptedPassword(password);
  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      req.session.auth = user.id;
      const serverRes = {
        message: "Login Succesful",
        data: user,
        session: req.session,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login Unsuccesful",
        error: "Invalid credentials",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}

export function logout(req, res) {
  const session = req.session.destroy();
  res.status(200).json({ message: "Logout successfully" });
}
