require("dotenv").config();
const { PASSWORD_TEST } = process.env;
const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

beforeEach(async () => {
    await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'duplicate@mail.com',
        password: PASSWORD_TEST,
        name: 'Test User',
        username: 'duplicateuser',
        phoneNumber: '08111113',
      });
});

afterAll(async() => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      sequelize.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("EndPoint /register", () => {
  it("Should be able to register", async () => {
    const response = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({ email: "testreg@mail.com", password: PASSWORD_TEST, name: "Test Nama", username: "usertest", phoneNumber: "08111112"  });
      console.log(response.body);
      

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Success creating new user");
    expect(response.body.data.id).toEqual(expect.any(Number));
    expect(response.body.data.name).toBe("Test Nama");
    expect(response.body.data.username).toBe("usertest");
    expect(response.body.data.email).toBe("testreg@mail.com");
    expect(response.body.data.role).toBe("admin");
    expect(response.body.data.phoneNumber).toBe("08111112");
    expect(response.body.data.address).toBeNull();
  });

  //Test Multiple Error
  //Empty Body
  it('Should return an error when no body is sent', async () => {
    const response = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({});

    expect(response.statusCode).toEqual(expect.any(Number));
    expect(response.statusCode).toBeGreaterThanOrEqual(400); 
    expect(response.statusCode).toBeLessThan(600); 
    expect(response.body.message).toEqual(expect.any(String)); 
    expect(response.body.error).toEqual(expect.any(String)); 
  });

  // Missing Fields
  it('Should return an error when required fields are missing', async () => {
    const response = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        password: PASSWORD_TEST, 
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
      expect(response.body.error).toEqual(expect.any(String)); 
  });


  // Test for duplicate email
  it('Should return an error for duplicate email', async () => {
    const response = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'duplicate@mail.com',
        password: PASSWORD_TEST,
        name: 'Another User',
        username: 'anotheruser',
        phoneNumber: '08111114',
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
  });

   // Test for duplicate username
   it('Should return an error for duplicate username', async () => {
    const response = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'another@mail.com',
        password: PASSWORD_TEST,
        name: 'Another User',
        username: 'duplicateuser',
        phoneNumber: '08111114',
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
      expect(response.body.error).toEqual(expect.any(String)); 
  });

   // Test for duplicate phoneNumber
   it('Should return an error for duplicate phoneNumber', async () => {
    const response = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'another@mail.com',
        password: PASSWORD_TEST,
        name: 'Another User',
        username: 'anotheruser',
        phoneNumber: '08111113',
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
      expect(response.body.error).toEqual(expect.any(String)); 
  });
});

describe("EndPoint /login", () => {
    it("Should be able to login", async () => {
      const response = await request(app)
        .post("/login")
        .set("Content-Type", "application/json")
        .send({ email: "duplicate@mail.com", password: PASSWORD_TEST  });
        console.log(response);
        
  
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toEqual(expect.any(String));
      const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/; // Regex for JWT
      expect(response.body.accessToken).toMatch(jwtRegex);
      expect(response.body.data.name).toBe("Test User");
      expect(response.body.data.role).toBe("admin");
      expect(response.body.data.id).toEqual(expect.any(Number));
    });
});
