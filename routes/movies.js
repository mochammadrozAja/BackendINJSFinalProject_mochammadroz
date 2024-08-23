const { index } = require("../controller/movies.controller");

const router = require("express").Router();

router.get("/", index);

module.exports = router;