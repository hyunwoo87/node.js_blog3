const express = require("express");
const router = express.Router();
const userSchema = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 내 정보 조회 API
router.get("/users/me", authMiddleware, async (req, res) => {
  console.log(res.locals.user);
  const { email, nickname } = res.locals.user;

  res.status(200).json({
    user: {
      email: email,
      nickname: nickname,
    },
  });
});

// 회원가입 API
router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  // 패스워드와 패스워드 일치 확인
  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드와 전달된 패스워드 확인값이 일치하지 않습니다",
    });
    return;
  }
  // email, nickname이 DB에 존재하는지 확인
  const isExistUser = await userSchema.findOne({
    // email, nickname이 일치할때 조회
    $or: [{ email }, { nickname }],
  });
  if (isExistUser) {
    res.status(400).json({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다",
    });
    return;
  }

  const user = new userSchema({ email, nickname, password });
  // DB에 저장
  await user.save();

  return res.status(201).json({});
});

module.exports = router;
