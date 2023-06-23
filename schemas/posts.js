const mongoose = require("mongoose");
// 'Posts'에 대한 스키마 정의
const postsSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
});

// 'Posts' 모델을 생성하고 postsSchema를 이용하여 스키마를 설정
module.exports = mongoose.model("Posts", postsSchema);
