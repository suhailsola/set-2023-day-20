import { async } from "regenerator-runtime";
import app from "../app";
import supertest from "supertest";
import dbInit from "../database/init";
import { PostgresConnection } from "../database/connection";
import { QueryTypes } from "sequelize";

const session = require("supertest-session");

describe("test login controller", function () {
  beforeAll(async function () {
    await dbInit();
  });

  //   positive test case
  test("Login with correct identifier and password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "afi",
      password: "1234",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("Login Succesful");
  });

  //   negative test case
  test("Empty identifier and password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "",
      password: "",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors.errors[0].msg).toBe("Cannot be empty");
  });

  test("Wrong identifier and password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "ali",
      password: "1234",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors.errors[0].msg).toBe("Not registered");
  });
});

describe("test register controller", function () {
  beforeAll(async function () {
    await dbInit();
  });

  afterAll(async function () {
    PostgresConnection.query("DELETE FROM users WHERE username='zahari'", {
      type: QueryTypes.DELETE,
    });
  });

  //   positive test case
  test("Register with correct username, email, and password", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "zahari",
      email: "zahari@mail.com",
      password: "1234",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("A user is created");
  });

  //   negative test case
  test("Register with short username", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "hob",
      email: "hob@mail.com",
      password: "1234",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors.errors[0].msg).toBe(
      "Must be at least 4 characters"
    );
  });

  test("Register with invalid email", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "arif",
      email: "arif",
      password: "1234",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors.errors[0].msg).toBe("Please put a valid email");
  });

  test("Register with same username", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "zahari",
      email: "arif",
      password: "1234",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors.errors[0].msg).toBe("User already exist");
  });

  test("Register with same email", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "alif",
      email: "suhail@mail.com",
      password: "1234",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors.errors[0].msg).toBe(
      "Email is already being used"
    );
  });
});

describe("Authentication", function () {
  let authSession;
  const identifier = "aziim";
  const password = "1234";

  beforeEach(async function () {
    authSession = session(app);
    const loginResponse = await authSession
      .post("/api/login")
      .send({ identifier, password });
  });

  beforeAll(async function () {
    // await dbInit();
  });

  test("Entering protected route", async function () {
    const dbQuery = await PostgresConnection.query(
      `SELECT * FROM users WHERE username='${identifier}' OR email='${identifier}'`,
      { type: QueryTypes.SELECT }
    );

    // const logResponse = await authSession
    //   .post("/api/login")
    //   .send({ identifier, password });
    // expect(logResponse.status).toBe(200);
    const res = await authSession.get("/api/protected");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Protected Route");
    expect(res.body.user).toBe(dbQuery[0].id);
  });

  test("Logging out", async function () {
    // await authSession.post("/api/login").send({ identifier, password });

    const result = await authSession.get("/api/logout");
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Logout successfully");
  });

  test("Unauthorised logout", async () => {
    const result = await supertest(app).get("/api/logout");
    expect(result.status).toBe(401);
    expect(result.body.message).toBe("Unauthorised");
  });
});
