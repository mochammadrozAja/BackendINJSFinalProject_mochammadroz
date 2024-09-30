require("dotenv").config();
const { PASSWORD_TEST } = process.env;
const request = require("supertest");
const app = require("../app");
const { sequelize, Movie, User } = require("../models");

let token;
let movies;

beforeAll(async () => {
  try {
    // create user & get token
    
    const user = await User.create({
      email: "testmovies@mail.com",
      password: PASSWORD_TEST,
      name: 'Test Movies',
      username: 'testmoviesuser',
      phoneNumber: '08111119',
      role: 'admin',
      address: 'Test Address',
    });

    

    token = user.generateToken(); 
    

    movies = await Movie.bulkCreate([
      { title: "Movie 1", synopsis: "Synopsis Movie 1", trailerUrl: "Trailer Movie 1", imgUrl: "Image Movie 1", rating: 5, status: "active" },
      { title: "Movie 2", synopsis: "Synopsis Movie 2", trailerUrl: "Trailer Movie 2", imgUrl: "Image Movie 2", rating: 5, status: "active" },
    ]);
    
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await Movie.destroy({ truncate: true, cascade: true });
    await User.destroy({ truncate: true, cascade: true });
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await sequelize.close();
  }
});

describe("EndPoint /movies", () => {
  it("Should be able to get all movies", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});