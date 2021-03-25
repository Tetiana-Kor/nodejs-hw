const request = require("supertest");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
require("dotenv").config();

const app = require("../app");
const { User, newUser } = require("../model/__mocks__/data");

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
User.token = token;

jest.mock("../model/contacts.js");
jest.mock("../model/users.js");

describe("Testing the route api/users", () => {
  let idUser;
  describe("Testing user registration", () => {
    it("should return 201 registration", async () => {
      const res = await request(app)
        .post("/api/users/auth/register")
        .send(newUser)
        .set("Accept", "application/json");

      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
    });
    it("should return 409 registration - email in use", async () => {
      const res = await request(app)
        .post("/api/users/auth/register")
        .send(newUser)
        .set("Accept", "application/json");

      expect(res.status).toEqual(409);
      expect(res.body).toBeDefined();
    });
    it("should return 400 registration required fields", async () => {
      const res = await request(app)
        .post("/api/users/auth/register")
        .send({ email: "", password: "" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });

  describe("Testing user login", () => {
    it("should return 200 login", async () => {
      const res = await request(app)
        .post("/api/users/auth/login")
        .send(newUser)
        .set("Accept", "application/json");

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
    it("should return 401 login", async () => {
      const res = await request(app)
        .post("/api/users/auth/login")
        .send({ email: "fake@test.com", password: "123456" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
  });

  describe("Testing update user", () => {
    it("should return 200 current user", async () => {
      const res = await request(app)
        .get("/api/users/current")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    it("should return 200 update subscription", async () => {
      const res = await request(app)
        .patch(`/api/users/sub/${idUser}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ subscription: "pro" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    it("should return 200 upload avatar", async () => {
      const buffer = await fs.readFile("./test/default.jpg");
      const res = await request(app)
        .patch(`/api/users/avatars`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", buffer, "default.jpg");

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data).toHaveProperty("avatarURL");
    });
    it("should return 204 logout user", async () => {
      const res = await request(app)
        .post(`/api/users/auth/logout`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(204);
      expect(res.body).toBeDefined();
    });
  });
});
