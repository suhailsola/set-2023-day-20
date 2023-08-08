import { Op } from "sequelize";
import Link from "../../database/model/Link";
import { generateRandomString } from "../../utils/helper";

export function createLink(req, res) {
  const link = req.body;
  const owner = req.user;
  const slug = generateRandomString(10);
  console.log(owner);
  Link.create({ slug, link, owner })
    .then(function (data) {
      console.log(data);
      res
        .status(200)
        .json({ message: "A link is created", data: data.dataValues });
    })
    .catch(function (error) {
      res.status(500).json({ message: "an error occured", data: error });
    });
}

export async function updateLink(req, res) {
  const { link } = req.body;
  const slug = req.params.slug;
  console.log("slug:", slug);
  const checkLink = await Link.update(
    { link },
    {
      where: { slug },
    }
  );
  console.log(checkLink);
  if (checkLink == 0) {
    return res.status(400).json({ message: "Link does not exist" });
  }
  return res.status(200).json({ message: "Link updated" });
}

export function listAllLinkByUserId(req, res) {
  const userId = req.params.userId;
  Link.findAndCountAll({
    // order: [["created_at", "DESC"]],
    attributes: ["slug", "link", "visit_counter"],
    where: {
      owner: userId,
    },
  })
    .then(function (data) {
      console.log(data.count);
      res.status(200).json({ message: "Links are found", data });
    })
    .catch(function (error) {
      res.status(500).json({ message: "an error occured", data: error });
    });
}

export function redirect(req, res) {
  const slug = req.params.slug;
  Link.findOne({
    where: { slug },
  })
    .then(function (data) {
      if (data?.dataValues) {
        console.log(data.dataValues);
        Link.update(
          { visit_counter: data.dataValues.visit_counter + 1 },
          {
            where: { slug },
          }
        )
          .then(function (data) {
            console.log("Does it come here");
            res.redirect(data.dataValues.link);
            return;
          })
          .catch(function (errorUpdate) {
            res
              .status(500)
              .json({ message: "An error occured", data: errorUpdate });
          });
        res.status(200).json({ data: data.dataValues.link });
      } else {
        res.status(400).json({ message: "Not found" });
      }
    })
    .catch(function (error) {
      res.status(500).json({ error });
    });
}
