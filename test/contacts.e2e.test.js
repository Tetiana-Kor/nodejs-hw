const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = require("../app");
const { User, contacts, newContact } = require("../model/__mocks__/data");

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
User.token = token;

jest.mock("../model/contacts.js");
jest.mock("../model/users.js");

describe("Testing the route api/contacts", () => {
  let idNewContact;
  describe("should handle get request", () => {
    it("should return 200 status for get all contacts", async () => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
    });

    it("should return 200 status for by id", async () => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact).toHaveProperty("_id");
      expect(res.body.data.contact._id).toBe(contact._id);
    });
    it("should return 404 status by wrong id", async () => {
      const wrongId = 111111;
      const res = await request(app)
        .get(`/api/contacts/${wrongId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });

  describe("should handle post request", () => {
    it("should return 201 status for add contact", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send(newContact)
        .set("Accept", "application/json");

      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      idNewContact = res.body.data.contact._id;
    });
    it("should return 400 status for wrong field", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...newContact, test: 1 })
        .set("Accept", "application/json");

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    it("should return 400 status without required field name", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "qwer" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    it("should return 400 status without required field email", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "test@ukr.net" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    it("should return 400 status without required field phone", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set("Authorization", `Bearer ${token}`)
        .send({ phone: "(987) 654-3211" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });

  describe("should handle patch request", () => {
    it("should return 200 status update contact", async () => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "qwer" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe("qwer");
    });
    it("should return 400 status for wrong field", async () => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ test: 1 })
        .set("Accept", "application/json");

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    it("should return 404 status with wrong id", async () => {
      const res = await request(app)
        .patch(`/api/contacts/123`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Ada" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });

  describe("should handle delete request", () => {
    it("should return 200 status update contact", async () => {
      const res = await request(app)
        .delete(`/api/contacts/${idNewContact}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
    it("should return 404 status for wrong id", async () => {
      const res = await request(app)
        .delete(`/api/contacts/12345`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });
});
