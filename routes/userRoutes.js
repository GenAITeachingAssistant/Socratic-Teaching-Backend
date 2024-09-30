const {
  signup,
  login,
  setAvatar,
  getAllUsers,
} = require("../controller/userController");

const { protect } = require("../middleware/protect");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", protect, getAllUsers);
router.post("/setAvatar/:id", protect, setAvatar);

module.exports = router;
