import Link from "../../database/model/Link";
import { generateRandomString } from "../../utils/helper";

export function createLink(req, res) {
  const { link } = req.body;
  const owner = req.user;
  const slug = generateRandomString(10);
  console.log(link);
  Link.create({ slug, link, owner })
    .then(function (data) {
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
  const userId = req.user;
  Link.findAndCountAll({
    // order: [["created_at", "DESC"]],
    attributes: ["slug", "link", "visit_counter", "created_at"],
    where: {
      owner: userId,
      deleted_at: null,
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
        const linkData = data.dataValues;
        console.log(linkData);

        Link.update(
          { visit_counter: linkData.visit_counter + 1 },
          { where: { slug } }
        )
          .then(function () {
            const targetUrl = linkData.link;
            console.log("Redirecting to:", targetUrl);
            res.redirect(targetUrl); // Perform the redirect
          })
          .catch(function (errorUpdate) {
            res
              .status(500)
              .json({ message: "An error occurred", data: errorUpdate });
          });
      } else {
        res.status(400).json({ message: "Not found" });
      }
    })
    .catch(function (error) {
      res.status(500).json({ message: "An error occurred", data: error });
    });
}

export async function deleteLink(req, res) {
  const slug = req.params.slug;
  try {
    await Link.destroy({
      where: {
        slug: slug,
      },
    });
    res.status(200).json({ message: "Link soft deleted", slug });
  } catch (error) {
    res.status(403).json({ message: "Link does not exist", error });
  }
}

export async function updateUsername(req, res) {
  const userId = req.user;
  const username = req.params.username;
  const getBody = req.body;
  try {
    await User.findOne({
      where: { id: userId, username },
    });
    await User.update(
      { username: getBody.username },
      {
        where: { id: userId, username },
      }
    );
    res
      .status(200)
      .json({ message: "Username updated", newUsername: getBody.username });
  } catch (error) {
    res.status(403).json({ error });
  }
}
