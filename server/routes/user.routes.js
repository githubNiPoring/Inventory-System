const router = require("express").Router();

const {
  getUsers,
  login,
  signup,
  verify,
} = require("../controller/user.controller");

router.get("/users", getUsers);
router.post("/login", login);
router.post("/signup", signup);
router.get("/:id/verify/:token", verify);

module.exports = router;
