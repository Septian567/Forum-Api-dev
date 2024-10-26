const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");
const InvariantError = require("../../../Commons/exceptions/InvariantError");

describe("CommentReplyRepositoryPostgres - deleteCommentReply", () => {
  const userId = "user-123";
  const threadId = "thread-123";
  const commentId = "comment-123";
  let commentReplyRepository;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      user_id: userId,
      thread_id: threadId,
    });
  });

  beforeEach(() => {
    commentReplyRepository = new CommentReplyRepositoryPostgres(pool, {});
  });

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("deleteCommentReply", () => {
    it("should delete reply correctly and mark it as deleted", async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addCommentReply({
        id: "reply-333",
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        is_delete: false,
      });

      // Action
      await commentReplyRepository.deleteCommentReply(
        "reply-333",
        threadId,
        commentId,
        userId
      );
      const deletedReply =
        await CommentRepliesTableTestHelper.getCommentReplyById("reply-333");

      // Assert
      expect(deletedReply[0].is_delete).toEqual(true);
      expect(deletedReply[0].content).toEqual("**balasan telah dihapus**");
    });

    it("should throw InvariantError when deletion fails", async () => {
      // Action & Assert
      await expect(
        commentReplyRepository.deleteCommentReply(
          "reply-333",
          "thread-121",
          "comment-111",
          "user-123"
        )
      ).rejects.toThrowError(InvariantError);
    });
  });
});
