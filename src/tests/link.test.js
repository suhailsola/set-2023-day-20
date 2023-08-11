import { async } from "regenerator-runtime";
import dbInit from "../database/init";

describe("Testing link controller", () => {
  let authSession;
  const identifier = "aziim";
  const password = "1234";
  const link = "https://www.npmjs.com/";

  beforeEach(async function () {
    authSession = session(app);
    await authSession.post("/api/login").send({ identifier, password });
  });

  beforeAll(async () => {
    await dbInit();
  });

  afterAll(async () => {
    PostgresConnection.query(
      `DELETE FROM links WHERE link='https://www.npmjs.com/'`,
      {
        type: QueryTypes.DELETE,
      }
    );
  });

  test("Create link")
});
