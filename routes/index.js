const auth = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.use(require("./auth"));
router.use(auth);
router.use("/movies", require("./movies"));
router.use(require("./bookmarks"));

module.exports = router;