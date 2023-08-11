import { Sequelize } from "sequelize";
import config from "../../config";

const { database, user, password, host, port } = config.postgres;

export const PostgresConnection = new Sequelize(database, user, password, {
  host: host,
  dialect: "postgres",
  logging: config.nodeEnv === "development",
  ssl:
    config.nodeEnv === "production"
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
});
