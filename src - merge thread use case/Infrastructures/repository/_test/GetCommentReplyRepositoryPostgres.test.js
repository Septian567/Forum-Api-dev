const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentReplyRepositoryPostgres - getCommentReply", () => {
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

  // Reusable assertion functions
  const expectReplyToMatch = (reply, { id, userId, threadId, commentId }) => {
    expect(reply.id).toEqual(id);
    expect(reply.user_id).toEqual(userId);
    expect(reply.thread_id).toEqual(threadId);
    expect(reply.comment_id).toEqual(commentId);
  };

  const expectRepliesArrayToHaveLength = (replies, expectedLength) => {
    expect(Array.isArray(replies)).toBe(true);
    expect(replies).toHaveLength(expectedLength);
  };

  describe("getCommentReplyById", () => {
    it("should return NotFoundError when reply not found", async () => {
      // Action & Assert
      await expect(
        commentReplyRepository.getCommentReplyById("wrong-reply")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return reply correctly", async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addCommentReply({
        id: "reply-333",
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
      });

      // Action
      const reply = await commentReplyRepository.getCommentReplyById(
        "reply-333"
      );

      // Assert
      expectReplyToMatch(reply, {
        id: "reply-333",
        userId,
        threadId,
        commentId,
      });
    });
  });

  describe("getCommentReplyByCommentId", () => {
    it("should return empty array when no reply found", async () => {
      // Action
      const commentReplies =
        await commentReplyRepository.getCommentReplyByCommentId(commentId);

      // Assert
      expectRepliesArrayToHaveLength(commentReplies, 0);
    });

    it("should return replies correctly", async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addCommentReply({
        id: "reply-333",
        comment_id: commentId,
      });
      await CommentRepliesTableTestHelper.addCommentReply({
        id: "reply-222",
        comment_id: commentId,
      });
      await CommentRepliesTableTestHelper.addCommentReply({
        id: "reply-111",
        comment_id: commentId,
      });

      // Action
      const replies = await commentReplyRepository.getCommentReplyByCommentId(
        commentId
      );

      // Assert
      expectRepliesArrayToHaveLength(replies, 3);
    });
  });
});
