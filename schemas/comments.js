const mongoose = require("mongoose");

// 'Comments'에 대한 스키마 정의
const commentsSchema = new mongoose.Schema({
  commentId: {
    type: String,
    required: true,
  },

  postId: {
    type: String,
    required: true,
  },

  nickname: {
    type: String,
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
});

// 'Comments' 모델을 생성하고 commentsSchema를 이용하여 스키마를 설정
module.exports = mongoose.model("Comments", commentsSchema);
