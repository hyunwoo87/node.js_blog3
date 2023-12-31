const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");
const Comments = require("../schemas/comments");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 해당 게시글 코멘트 조회 API
router.get("/posts/:userId/comments", async (req, res) => {
  const { userId } = req.params;

  try {
    // 게시물의 존재 여부를 확인
    const post = await Posts.find({ userId: userId });
    if (!post) {
      return res.status(404).json({ error: "게시물이 없습니다" });
    }

    // 게시물에 연결된 모든 코멘트를 조회
    const comments = await Comments.find({ userId: commentId })
      .select(" -__v")
      .sort({ createdAt: -1 });
    if (comments.length === 0) {
      return res.status(404).json({ error: "게시물에 달린 댓글이 없습니다" });
    }

    res.json({ data: comments });
  } catch (error) {
    res.status(500).json({ error: "게시물 조회에 실패했습니다" });
  }
});

// 코멘트 작성 API
router.post("/posts/:userId/comments", authMiddleware, async (req, res) => {
  const { nickname, comment } = req.body;
  const { userId } = req.params;
  const { user } = res.locals;

  // 한 글자도 입력하지 않았을 상황에 대한 예외처리
  if (!nickname || !comment) {
    return res.status(400).json({
      success: false,
      error: "댓글이나 닉네임을 입력해주세요",
    });
  }

  try {
    // 게시물의 존재 여부를 확인
    const post = await Posts.findById(userId);
    if (!post) {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다" });
    }

    // 코멘트를 저장
    await Comments.create({
      userId: user.userId,
      nickname,
      comment,
      createdAt: new Date(),
    });

    // 생성된 코멘트를 응답
    res.json({ message: "댓글을 작성하였습니다" });
  } catch (error) {
    // 오류가 발생한 경우 오류 메시지를 응답
    res.status(500).json({ error: "댓글 작성에 실패했습니다" });
  }
});

// 코멘트 수정 API
router.patch(
  "/posts/:userId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { comment } = req.body;
    const { userId, commentId } = req.params;
    const { user } = res.locals;

    try {
      // 게시물의 존재 여부를 확인
      const post = await Posts.findById(userId);
      if (!post) {
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다" });
      }

      // 코멘트의 존재 여부를 확인
      const existingComment = await Comments.findById(commentId);
      if (!existingComment) {
        return res.status(404).json({ error: "코멘트를 찾을 수 없습니다" });
      }

      if (user.userId !== existingComment.userId) {
        return res.status(400).json({ error: "접근이 허용되지 않습니다" });
      }

      // 입력된 코멘트 값의 유효성을 검사
      if (!comment) {
        return res.status(400).json({ error: "코멘트를 입력해주세요" });
      }

      /// 코멘트를 업데이트
      existingComment.comment = comment;
      await existingComment.save();

      // 업데이트된 코멘트를 응답
      res.json({ message: "댓글을 수정하였습니다" });
    } catch (error) {
      // 오류가 발생한 경우 오류 메시지를 응답
      res.status(500).json({ error: "댓글 수정에 실패했습니다" });
    }
  }
);

// 코멘트 삭제 API
router.delete(
  "/posts/:userId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { userId, commentId } = req.params;
    const { user } = res.locals;

    try {
      // 게시물의 존재 여부를 확인
      const post = await Posts.findById(userId);
      if (!post) {
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다" });
      }

      // 코멘트의 존재 여부를 확인
      const existingComment = await Comments.findById(commentId);
      if (!existingComment) {
        return res.status(404).json({ error: "코멘트를 찾을 수 없음" });
      }

      if (user.userId !== existingComment.userId) {
        return res.status(400).json({ error: "권한 없음" });
      }

      // 코멘트를 삭제
      await Comments.deleteOne(existingComment);

      res.status(200).json({ message: "댓글 삭제" });
    } catch (error) {
      res.status(500).json({ error: "댓글 삭제 실패" });
    }
  }
);

module.exports = router;
