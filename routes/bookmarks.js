const { create, index } = require("../controller/bookmark.controller");

const router = require("express").Router();

// router.use(isAdmin);
router.post("/bookmark/:id", create);
router.get("/mybookmark", index);


module.exports = router;