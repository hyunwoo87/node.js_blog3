const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  // authType 가 Bearer값인지 확인
  // authToken 검증
  if (authType !== "Bearer" || !authToken) {
    res.status(400).json({
      errorMessage: "로그인 후에 이용할 수 있습니다",
    });
    return;
  }

  try {
    // authToken이 만료되었는지 확인
    // authToken이 서버가 발급한 토큰이 맞는지 확인
    const { userId } = jwt.verify(authToken, "customized-secret-key");

    // authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
    const user = await User.findById(userId);
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ errorMessage: "로그인 후에 이용할 수 있습니다" });
    return;
  }
};
