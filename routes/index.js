const router = require("express").Router();

router.use(require("./auth"));
router.use("/movies", require("./movies"));

module.exports = router;