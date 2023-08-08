import { DataTypes } from "sequelize";
import { PostgresConnection } from "../connection";
import User from "./User";

const Link = PostgresConnection.define(
  "Link",
  {
    // Model attributes are defined here
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      //   unique: true,
      allowNull: false,
    },
    visit_counter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    underscored: true,
    paranoid: true,
    timestamps: true,
  }
);

Link.belongsTo(User, {
  foreignKey: "owner",
});

export default Link;
