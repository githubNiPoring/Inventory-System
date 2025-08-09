const router = require("express").Router();

const {
  checkAuth,
  login,
  signup,
  verify,
  logout,
} = require("../controller/user.controller");

router.get("/check-auth", checkAuth);
router.post("/login", login);
router.post("/signup", signup);
router.get("/:id/verify/:token", verify);
router.post("/logout", logout);

module.exports = router;
