require("dotenv").config();
const { PASSWORD_TEST } = process.env;
const request = require("supertest");
const app = require("../app");
const { sequelize, Movie, Bookmark, User } = require("../models");

let token;
let bookmarks;
let movies;
let users;

beforeAll(async () => {
  try {
    // create user & get token
    users = await User.bulkCreate([
        { email: "user1@mail.com", password: PASSWORD_TEST, name: 'Test User 1', username: 'testuser1', phoneNumber: '08111121' },
        { email: "user2@mail.com", password: PASSWORD_TEST, name: 'Test User 2', username: 'testuser2', phoneNumber: '08111122' },
    ]);
  

    token = await users[0].generateToken();

    movies = await Movie.bulkCreate([
      { title: "Movie Bookmark 1", synopsis: "Synopsis Movie 1", trailerUrl: "Trailer Movie 1", imgUrl: "Image Movie 1", rating: 5, status: "active" },
      { title: "Movie Bookmark 2", synopsis: "Synopsis Movie 2", trailerUrl: "Trailer Movie 2", imgUrl: "Image Movie 2", rating: 5, status: "active" },
      { title: "Movie Bookmark 3", synopsis: "Synopsis Movie 3", trailerUrl: "Trailer Movie 3", imgUrl: "Image Movie 3", rating: 5, status: "active" },
    ]);

    bookmarks = await Bookmark.bulkCreate([
        { movieId: movies[0].id, userId: users[0].id  },
        { movieId: movies[1].id, userId: users[0].id  },
        { movieId: movies[1].id, userId: users[1].id  },
    ]);    
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
    await Bookmark.destroy({ truncate: true });
    await Movie.destroy({ truncate: true, cascade: true });
    await User.destroy({ truncate: true, cascade: true });
    await sequelize.close();
});

describe("EndPoint /mybookmark", () => {
  it("Should be able to get all user's bookmark", async () => {
    const response = await request(app)
      .get("/mybookmark")
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(2);
    expect(response.body[0].movie.title).toBe(movies[0].title);
    expect(response.body[1].movie.title).toBe(movies[1].title);
  });
});

describe("EndPoint /bookmark", () => {
  it("Should be able to bookmark by movie id", async () => {
    const response = await request(app)
        .post(`/bookmark/${movies[2].id}`)
        .set("Content-Type", "application/json")
        .auth(token, { type: "bearer" });
   
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Success adding new bookmark");
    expect(response.body.data.id).toEqual(expect.any(Number));
    expect(response.body.data.userId).toBe(users[0].id);
    expect(response.body.data.movieId).toBe(movies[2].id);
    expect(response.body.data.movie).toBe(movies[2].title);
  });
});