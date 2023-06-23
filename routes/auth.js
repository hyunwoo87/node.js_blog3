const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

// 로그인 API
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  // 이메일이 일치하는 유저를 찾음
  const user = await User.findOne({ email });

  // 이메일이 일치하는 유저가 없거나
  // 유저를 찾앗지만 비밀번호가 다를때
  if (!user || password !== user.password) {
    res.status(400).json({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }
  // jwt 생성
  const token = jwt.sign({ userId: user.userId }, "customized-secret-key");

  res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당
  res.status(200).json({ token }); // JWT를 Body로 할당
});

module.exports = router;
